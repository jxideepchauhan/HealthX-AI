import { Router } from 'express';
import { prisma } from '@healthx/database';
import { authMiddleware } from '../middleware/auth';

export const timelineRouter = Router();

timelineRouter.use(authMiddleware);

// GET /api/v1/timeline
timelineRouter.get('/', async (req, res, next) => {
  try {
    const typeFilter = req.query.type as string;
    const fromDate = req.query.from as string;
    const toDate = req.query.to as string;

    const where: any = { userId: req.user!.userId };

    if (typeFilter && typeFilter !== 'ALL') {
      where.eventType = typeFilter;
    }

    if (fromDate || toDate) {
      where.eventDate = {};
      if (fromDate) where.eventDate.gte = fromDate;
      if (toDate) where.eventDate.lte = toDate;
    }

    const events = await prisma.timelineEvent.findMany({
      where,
      include: {
        sourceDocument: {
          select: { id: true, title: true, fileName: true, fileType: true },
        },
      },
      orderBy: { eventDate: 'desc' },
    });

    res.json({
      events,
      totalCount: events.length,
    });
  } catch (err) {
    next(err);
  }
});
