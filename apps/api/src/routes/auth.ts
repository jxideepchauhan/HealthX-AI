import { Router } from 'express';
import { prisma } from '@healthx/database';
import {
  generateOTP,
  hashOTP,
  generateSalt,
  verifyOTP,
  verifyPassword,
  createAccessToken,
  createRefreshToken,
  checkRateLimit,
  createAuditLog,
} from '@healthx/security';
import { RequestOtpSchema, VerifyOtpSchema, LoginPasswordSchema, AppError } from '@healthx/shared';
import { authMiddleware } from '../middleware/auth';

export const authRouter = Router();

// POST /api/v1/auth/request-otp
authRouter.post('/request-otp', async (req, res, next) => {
  try {
    const { identifier, role } = RequestOtpSchema.parse(req.body);

    // Rate limiting: max 5 requests per minute
    checkRateLimit(`otp-req:${identifier}`, 5, 60 * 1000);

    const otp = generateOTP();
    const salt = generateSalt();
    const otpHash = hashOTP(otp, salt);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.upsert({
      where: { identifier },
      update: {
        otpHash,
        otpSalt: salt,
        otpExpiresAt: expiresAt,
        failedOtpCount: 0,
      },
      create: {
        identifier,
        role,
        otpHash,
        otpSalt: salt,
        otpExpiresAt: expiresAt,
      },
    });

    // In local development/testing, return OTP in response for easy verification
    // In production, dispatch via SMS/Email provider
    const isDev = process.env.NODE_ENV !== 'production';

    res.json({
      message: 'OTP sent successfully to registered identifier.',
      expiresInSeconds: 600,
      ...(isDev ? { devOtpCode: otp } : {}),
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/auth/verify-otp
authRouter.post('/verify-otp', async (req, res, next) => {
  try {
    const { identifier, otp } = VerifyOtpSchema.parse(req.body);

    // Brute force rate limit: 5 attempts
    checkRateLimit(`otp-verify:${identifier}`, 5, 5 * 60 * 1000);

    const user = await prisma.user.findUnique({
      where: { identifier },
    });

    if (!user || !user.otpHash || !user.otpSalt || !user.otpExpiresAt) {
      throw new AppError('INVALID_CREDENTIALS', 'No active OTP request found. Please request a new OTP.', 401);
    }

    if (new Date() > user.otpExpiresAt) {
      throw new AppError('OTP_EXPIRED', 'OTP has expired. Please request a new OTP.', 401);
    }

    const isValid = verifyOTP(otp, user.otpHash, user.otpSalt);
    if (!isValid) {
      await prisma.user.update({
        where: { id: user.id },
        data: { failedOtpCount: { increment: 1 } },
      });
      throw new AppError('INVALID_OTP', 'Incorrect OTP entered.', 401);
    }

    // Clear OTP upon successful verification
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpHash: null,
        otpSalt: null,
        otpExpiresAt: null,
        failedOtpCount: 0,
      },
    });

    const tokenPayload = {
      userId: user.id,
      role: user.role as any,
      identifier: user.identifier,
    };

    const accessToken = createAccessToken(tokenPayload);
    const refreshToken = createRefreshToken(tokenPayload);

    // Secure HTTP-only cookie
    res.cookie('healthx_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600 * 1000,
    });

    // Log audit event
    const audit = createAuditLog(user.id, user.role as any, 'CREATE', 'Session', user.id, 'SUCCESS');
    await prisma.auditEvent.create({
      data: {
        userId: user.id,
        userRole: user.role,
        action: audit.action,
        resource: audit.resource,
        resourceId: audit.resourceId,
        result: audit.result,
        hash: audit.hash,
        previousHash: audit.previousHash,
        timestamp: audit.timestamp,
      },
    });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        identifier: user.identifier,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/auth/login-password (Login via Unique ID or Email and Password)
authRouter.post('/login-password', async (req, res, next) => {
  try {
    const { identifier, password, role } = LoginPasswordSchema.parse(req.body);

    checkRateLimit(`pwd-login:${identifier}`, 10, 5 * 60 * 1000);

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { identifier: identifier },
          { uniqueId: identifier },
          { identifier: identifier.toLowerCase() },
          { uniqueId: identifier.toUpperCase() },
        ],
      },
      include: { profile: true },
    });

    if (!user || !user.passwordHash || !user.passwordSalt) {
      throw new AppError('INVALID_CREDENTIALS', 'Invalid Unique ID / Email or Password.', 401);
    }

    if (role && user.role !== role && user.role !== 'ADMIN') {
      throw new AppError('UNAUTHORIZED', `User is registered with role ${user.role}, not ${role}.`, 403);
    }

    const isValid = verifyPassword(password, user.passwordHash, user.passwordSalt);
    if (!isValid) {
      throw new AppError('INVALID_CREDENTIALS', 'Invalid Unique ID / Email or Password.', 401);
    }

    const tokenPayload = {
      userId: user.id,
      role: user.role as any,
      identifier: user.identifier,
    };

    const accessToken = createAccessToken(tokenPayload);
    const refreshToken = createRefreshToken(tokenPayload);

    res.cookie('healthx_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600 * 1000,
    });

    const audit = createAuditLog(user.id, user.role as any, 'CREATE', 'SessionPassword', user.id, 'SUCCESS');
    await prisma.auditEvent.create({
      data: {
        userId: user.id,
        userRole: user.role,
        action: audit.action,
        resource: audit.resource,
        resourceId: audit.resourceId,
        result: audit.result,
        hash: audit.hash,
        previousHash: audit.previousHash,
        timestamp: audit.timestamp,
      },
    });

    res.json({
      message: 'Authentication successful.',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        identifier: user.identifier,
        uniqueId: user.uniqueId,
        role: user.role,
        doctorLicense: user.doctorLicense,
        hospitalCode: user.hospitalCode,
        name: user.profile?.name || user.identifier,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/auth/logout
authRouter.post('/logout', (_req, res) => {
  res.clearCookie('healthx_token');
  res.json({ message: 'Successfully logged out.' });
});

// GET /api/v1/auth/session
authRouter.get('/session', authMiddleware, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: { profile: true },
    });

    if (!user) {
      throw new AppError('UNAUTHORIZED', 'Session invalid', 401);
    }

    res.json({
      user: {
        id: user.id,
        identifier: user.identifier,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (err) {
    next(err);
  }
});
