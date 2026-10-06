import { Router } from 'express';
import { prisma } from '@healthx/database';
import { authMiddleware } from '../middleware/auth';

export const auditRouter = Router();

auditRouter.use(authMiddleware);

// GET /api/v1/audit
auditRouter.get('/', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const isSystemAdmin = req.user!.role === 'ADMIN';

    const events = await prisma.auditEvent.findMany({
      where: isSystemAdmin ? {} : { userId },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });

    res.json({
      auditEvents: events,
      count: events.length,
    });
  } catch (err) {
    next(err);
  }
});
