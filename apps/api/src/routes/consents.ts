import { Router } from 'express';
import { prisma } from '@healthx/database';
import { authMiddleware } from '../middleware/auth';
import { CreateConsentSchema, AppError } from '@healthx/shared';
import { createAuditLog } from '@healthx/security';

export const consentsRouter = Router();

consentsRouter.use(authMiddleware);

// GET /api/v1/consents (List consents for patient or recipient)
consentsRouter.get('/', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const consents = await prisma.consent.findMany({
      where: {
        OR: [{ patientId: userId }, { recipientId: userId }],
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ consents });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/consents (Grant new consent)
consentsRouter.post('/', async (req, res, next) => {
  try {
    const data = CreateConsentSchema.parse(req.body);
    const patientId = req.user!.userId;

    const consent = await prisma.consent.create({
      data: {
        patientId,
        recipientId: data.recipientId,
        recipientName: data.recipientName,
        recipientRole: data.recipientRole,
        organizationId: data.organizationId,
        organizationName: data.organizationName,
        scope: data.scope,
        recordsJson: JSON.stringify(data.records || []),
        startDate: data.startDate || new Date().toISOString(),
        expiryDate: data.expiryDate,
        status: 'ACTIVE',
        purpose: data.purpose,
      },
    });

    // Audit Log
    const audit = createAuditLog(patientId, req.user!.role, 'CREATE', 'Consent', consent.id, 'SUCCESS');
    await prisma.auditEvent.create({
      data: {
        userId: patientId,
        userRole: req.user!.role,
        action: audit.action,
        resource: audit.resource,
        resourceId: audit.resourceId,
        result: audit.result,
        hash: audit.hash,
        previousHash: audit.previousHash,
        timestamp: audit.timestamp,
      },
    });

    res.status(201).json({ consent });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/consents/:id (Modify or Revoke consent)
consentsRouter.patch('/:id', async (req, res, next) => {
  try {
    const consent = await prisma.consent.findFirst({
      where: { id: req.params.id, patientId: req.user!.userId },
    });

    if (!consent) {
      throw new AppError('NOT_FOUND', 'Consent record not found', 404);
    }

    const { status, scope, expiryDate } = req.body;
    const updateData: any = {};
    if (status) updateData.status = status;
    if (scope) updateData.scope = scope;
    if (expiryDate) updateData.expiryDate = expiryDate;

    const updated = await prisma.consent.update({
      where: { id: consent.id },
      data: updateData,
    });

    // Audit log
    const auditAction = status === 'REVOKED' ? 'REVOKE' : 'UPDATE';
    const audit = createAuditLog(req.user!.userId, req.user!.role, auditAction, 'Consent', updated.id, 'SUCCESS');
    await prisma.auditEvent.create({
      data: {
        userId: req.user!.userId,
        userRole: req.user!.role,
        action: audit.action,
        resource: audit.resource,
        resourceId: audit.resourceId,
        result: audit.result,
        hash: audit.hash,
        previousHash: audit.previousHash,
        timestamp: audit.timestamp,
      },
    });

    res.json({ consent: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/consents/:id (Revoke/delete consent)
consentsRouter.delete('/:id', async (req, res, next) => {
  try {
    const consent = await prisma.consent.findFirst({
      where: { id: req.params.id, patientId: req.user!.userId },
    });

    if (!consent) {
      throw new AppError('NOT_FOUND', 'Consent record not found', 404);
    }

    // Immediately mark as REVOKED
    await prisma.consent.update({
      where: { id: consent.id },
      data: { status: 'REVOKED' },
    });

    res.json({ message: 'Consent successfully revoked. Access has been immediately terminated.' });
  } catch (err) {
    next(err);
  }
});
