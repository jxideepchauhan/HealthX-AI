import { Router } from 'express';
import { prisma } from '@healthx/database';
import { authMiddleware } from '../middleware/auth';
import { CreateMedicationSchema, AppError } from '@healthx/shared';

export const medicationsRouter = Router();

medicationsRouter.use(authMiddleware);

// GET /api/v1/medications
medicationsRouter.get('/', async (req, res, next) => {
  try {
    const medications = await prisma.medication.findMany({
      where: { userId: req.user!.userId },
      include: { sourceDocument: { select: { title: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ medications });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/medications
medicationsRouter.post('/', async (req, res, next) => {
  try {
    const data = CreateMedicationSchema.parse(req.body);

    const med = await prisma.medication.create({
      data: {
        userId: req.user!.userId,
        name: data.name,
        genericName: data.genericName,
        strength: data.strength,
        dosage: data.dosage,
        frequency: data.frequency,
        route: data.route,
        duration: data.duration,
        startDate: data.startDate || new Date().toISOString().split('T')[0],
        endDate: data.endDate,
        prescriber: data.prescriber,
        instructions: data.instructions,
        dataOrigin: 'USER_PROVIDED',
        verificationStatus: 'USER_VERIFIED',
        isActive: true,
      },
    });

    res.status(201).json({ medication: med });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/medications/:id
medicationsRouter.patch('/:id', async (req, res, next) => {
  try {
    const med = await prisma.medication.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
    });

    if (!med) {
      throw new AppError('NOT_FOUND', 'Medication not found', 404);
    }

    const updated = await prisma.medication.update({
      where: { id: med.id },
      data: req.body,
    });

    res.json({ medication: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/medications/:id
medicationsRouter.delete('/:id', async (req, res, next) => {
  try {
    const med = await prisma.medication.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
    });

    if (!med) {
      throw new AppError('NOT_FOUND', 'Medication not found', 404);
    }

    await prisma.medication.delete({ where: { id: med.id } });
    res.json({ message: 'Medication deleted successfully' });
  } catch (err) {
    next(err);
  }
});
