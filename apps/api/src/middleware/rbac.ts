import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@healthx/shared';
import { assertAccess } from '@healthx/security';
import { prisma } from '@healthx/database';
import type { UserRole, ConsentScope, ConsentRecord } from '@healthx/types';

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('UNAUTHORIZED', 'Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('FORBIDDEN', `Forbidden: Action requires role ${roles.join(' or ')}`, 403));
    }

    next();
  };
}

export async function checkConsentAccess(
  req: Request,
  patientId: string,
  scope: ConsentScope
): Promise<void> {
  if (!req.user) {
    throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
  }

  if (req.user.userId === patientId) {
    return; // Patient accessing own data
  }

  // Retrieve active consents for this patient
  const consents = await prisma.consent.findMany({
    where: {
      patientId,
      status: 'ACTIVE',
    },
  });

  const formattedConsents: ConsentRecord[] = consents.map((c) => ({
    id: c.id,
    patientId: c.patientId,
    recipientId: c.recipientId,
    recipientName: c.recipientName,
    recipientRole: c.recipientRole as UserRole,
    organizationId: c.organizationId || undefined,
    organizationName: c.organizationName || undefined,
    scope: c.scope as ConsentScope,
    startDate: c.startDate,
    expiryDate: c.expiryDate,
    status: c.status as 'ACTIVE' | 'EXPIRED' | 'REVOKED',
    purpose: c.purpose,
    createdAt: c.createdAt.toISOString(),
  }));

  assertAccess(req.user.userId, req.user.role, patientId, scope, formattedConsents);
}
