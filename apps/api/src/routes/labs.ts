import { Router } from 'express';
import { prisma } from '@healthx/database';
import { authMiddleware } from '../middleware/auth';
import { AppError } from '@healthx/shared';

export const labsRouter = Router();

labsRouter.use(authMiddleware);

// GET /api/v1/labs
labsRouter.get('/', async (req, res, next) => {
  try {
    const labs = await prisma.labResult.findMany({
      where: { userId: req.user!.userId },
      include: { sourceDocument: { select: { title: true, fileName: true } } },
      orderBy: { testDate: 'desc' },
    });

    res.json({ labs });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/labs/compare
labsRouter.get('/compare', async (req, res, next) => {
  try {
    const testName = req.query.testName as string;
    if (!testName) {
      throw new AppError('VALIDATION_ERROR', 'Query param "testName" is required for comparison');
    }

    const history = await prisma.labResult.findMany({
      where: {
        userId: req.user!.userId,
        OR: [
          { testName: { contains: testName } },
          { normalizedName: { contains: testName } },
        ],
      },
      orderBy: { testDate: 'asc' },
    });

    res.json({
      testName,
      count: history.length,
      history,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/labs/:id/history
labsRouter.get('/:id/history', async (req, res, next) => {
  try {
    const targetLab = await prisma.labResult.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
    });

    if (!targetLab) {
      throw new AppError('NOT_FOUND', 'Lab result not found', 404);
    }

    const history = await prisma.labResult.findMany({
      where: {
        userId: req.user!.userId,
        normalizedName: targetLab.normalizedName || targetLab.testName,
      },
      orderBy: { testDate: 'asc' },
    });

    res.json({
      testName: targetLab.testName,
      normalizedName: targetLab.normalizedName,
      unit: targetLab.unit,
      history,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/labs/:id
labsRouter.get('/:id', async (req, res, next) => {
  try {
    const lab = await prisma.labResult.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
      include: { sourceDocument: true },
    });

    if (!lab) {
      throw new AppError('NOT_FOUND', 'Lab result not found', 404);
    }

    res.json({ lab });
  } catch (err) {
    next(err);
  }
});
