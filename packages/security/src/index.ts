/**
 * HealthX AI Security & Access Control Package
 * Implements authentication, authorization, OTP management, consent validation,
 * audit logging, and input sanitization.
 */

import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { AppError } from '@healthx/shared';
import type {
  UserRole,
  ConsentScope,
  ConsentRecord,
  AuditRecord,
  AuditAction,
  AuditResult,
} from '@healthx/types';

const DEFAULT_JWT_SECRET = process.env.AUTH_SECRET || 'healthx-ai-super-secure-production-jwt-secret-key-2026';
const ACCESS_TOKEN_TTL = '1h';
const REFRESH_TOKEN_TTL = '7d';

export interface TokenPayload {
  userId: string;
  role: UserRole;
  identifier: string;
}

// ------------------------------------------
// 1. JWT & SESSION MANAGEMENT
// ------------------------------------------

export function createAccessToken(payload: TokenPayload, secret = DEFAULT_JWT_SECRET): string {
  return jwt.sign(payload, secret, { expiresIn: ACCESS_TOKEN_TTL });
}

export function createRefreshToken(payload: TokenPayload, secret = DEFAULT_JWT_SECRET): string {
  return jwt.sign(payload, secret, { expiresIn: REFRESH_TOKEN_TTL });
}

export function verifyToken(token: string, secret = DEFAULT_JWT_SECRET): TokenPayload {
  try {
    return jwt.verify(token, secret) as TokenPayload;
  } catch (err) {
    throw new AppError('UNAUTHORIZED', 'Invalid or expired authentication session', 401);
  }
}

// ------------------------------------------
// 2. PASSWORDLESS OTP GENERATION & VERIFICATION
// ------------------------------------------

export function generateOTP(): string {
  // Cryptographically secure 6-digit OTP
  const num = crypto.randomInt(100000, 999999);
  return num.toString();
}

export function hashOTP(otp: string, salt: string): string {
  return crypto.createHmac('sha256', salt).update(otp).digest('hex');
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function verifyOTP(inputOtp: string, expectedHash: string, salt: string): boolean {
  const computed = hashOTP(inputOtp, salt);
  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(expectedHash));
}

// ------------------------------------------
// 2b. SECURE PASSWORD HASHING & VERIFICATION (PBKDF2-SHA512)
// ------------------------------------------

export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

export function verifyPassword(password: string, expectedHash: string, salt: string): boolean {
  try {
    const computed = hashPassword(password, salt);
    return crypto.timingSafeEqual(Buffer.from(computed, 'hex'), Buffer.from(expectedHash, 'hex'));
  } catch {
    return false;
  }
}

// In-Memory Rate Limiter & Brute-Force Tracker
interface RateLimitEntry {
  count: number;
  resetAt: number;
  blockedUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export function checkRateLimit(
  key: string,
  limit = 5,
  windowMs = 60 * 1000,
  blockDurationMs = 15 * 60 * 1000
): void {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (entry) {
    if (entry.blockedUntil && entry.blockedUntil > now) {
      const waitSec = Math.ceil((entry.blockedUntil - now) / 1000);
      throw new AppError(
        'RATE_LIMIT_EXCEEDED',
        `Too many attempts. Account is temporarily locked. Try again in ${waitSec}s.`,
        429
      );
    }

    if (now > entry.resetAt) {
      rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
      return;
    }

    entry.count += 1;
    if (entry.count > limit) {
      entry.blockedUntil = now + blockDurationMs;
      throw new AppError(
        'RATE_LIMIT_EXCEEDED',
        `Rate limit exceeded. Temporarily locked for security.`,
        429
      );
    }
  } else {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
  }
}

// ------------------------------------------
// 3. CONSENT EVALUATION & ACCESS CONTROL
// ------------------------------------------

export function canAccessResource(
  requestorId: string,
  requestorRole: UserRole,
  resourceOwnerId: string,
  requestedScope: ConsentScope,
  activeConsents: ConsentRecord[] = []
): { allowed: boolean; reason?: string } {
  // Rule 1: The patient always has access to their own data
  if (requestorId === resourceOwnerId) {
    return { allowed: true };
  }

  // Rule 2: SYSTEM role has background execution rights
  if (requestorRole === 'SYSTEM') {
    return { allowed: true };
  }

  // Rule 3: ADMIN has administrative rights, but cannot view private clinical records without consent
  if (requestorRole === 'ADMIN') {
    // Admin is prohibited from silent viewing of clinical records per specification 81
    return {
      allowed: false,
      reason: 'Administrators are strictly prohibited from accessing private medical records without explicit clinical consent',
    };
  }

  // Rule 4: Doctor / Hospital requires valid, unexpired, non-revoked consent
  const now = new Date().toISOString();
  const validConsent = activeConsents.find((c) => {
    const isRecipientMatch = c.recipientId === requestorId || (c.organizationId && c.organizationId === requestorId);
    const isStatusActive = c.status === 'ACTIVE';
    const isNotExpired = c.expiryDate > now;
    const isScopeMatch = c.scope === 'ALL' || c.scope === requestedScope;
    return isRecipientMatch && isStatusActive && isNotExpired && isScopeMatch;
  });

  if (validConsent) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: `Access denied. No active, non-expired consent grant found for scope '${requestedScope}'.`,
  };
}

export function assertAccess(
  requestorId: string,
  requestorRole: UserRole,
  resourceOwnerId: string,
  requestedScope: ConsentScope,
  activeConsents: ConsentRecord[] = []
): void {
  const check = canAccessResource(
    requestorId,
    requestorRole,
    resourceOwnerId,
    requestedScope,
    activeConsents
  );
  if (!check.allowed) {
    throw new AppError('FORBIDDEN', check.reason || 'Access denied by authorization policy', 403);
  }
}

// ------------------------------------------
// 4. AUDIT LOGGING & INTEGRITY CHAIN
// ------------------------------------------

let lastAuditHash = '0000000000000000000000000000000000000000000000000000000000000000';

export function createAuditLog(
  userId: string,
  userRole: UserRole,
  action: AuditAction,
  resource: string,
  resourceId: string,
  result: AuditResult,
  ipAddress?: string,
  userAgent?: string,
  metadata?: Record<string, unknown>
): AuditRecord & { hash: string; previousHash: string } {
  const timestamp = new Date().toISOString();
  const id = crypto.randomUUID();

  const recordPayload = JSON.stringify({
    id,
    userId,
    userRole,
    action,
    resource,
    resourceId,
    result,
    timestamp,
    previousHash: lastAuditHash,
  });

  const hash = crypto.createHash('sha256').update(recordPayload).digest('hex');
  const previousHash = lastAuditHash;
  lastAuditHash = hash;

  return {
    id,
    userId,
    userRole,
    action,
    resource,
    resourceId,
    timestamp,
    ipAddress,
    userAgent,
    result,
    metadata,
    hash,
    previousHash,
  };
}

// ------------------------------------------
// 5. INPUT SANITIZATION & FILE SECURITY
// ------------------------------------------

export function sanitizeFileName(name: string): string {
  // Prevent path traversal attacks like ../../../etc/passwd
  const base = name.replace(/^.*[\\/]/, '');
  return base.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export function computeFileHash(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}
