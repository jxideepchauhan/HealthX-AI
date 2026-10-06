import { Router } from 'express';
import { prisma } from '@healthx/database';
import { authMiddleware } from '../middleware/auth';
import { AppError } from '@healthx/shared';

export const searchRouter = Router();

searchRouter.use(authMiddleware);

// GET /api/v1/search?q=
searchRouter.get('/', async (req, res, next) => {
  try {
    const q = req.query.q as string;
    if (!q || q.trim().length === 0) {
      throw new AppError('VALIDATION_ERROR', 'Search query "q" is required');
    }

    const userId = req.user!.userId;
    const term = q.trim();

    // 1. Documents
    const documents = await prisma.document.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: term } },
          { fileName: { contains: term } },
        ],
      },
      select: { id: true, title: true, fileName: true, fileType: true, createdAt: true },
    });

    // 2. Labs
    const labs = await prisma.labResult.findMany({
      where: {
        userId,
        OR: [
          { testName: { contains: term } },
          { normalizedName: { contains: term } },
        ],
      },
    });

    // 3. Medications
    const medications = await prisma.medication.findMany({
      where: {
        userId,
        OR: [
          { name: { contains: term } },
          { genericName: { contains: term } },
        ],
      },
    });

    // 4. Encounters
    const encounters = await prisma.encounter.findMany({
      where: {
        userId,
        OR: [
          { doctorName: { contains: term } },
          { hospitalName: { contains: term } },
          { reason: { contains: term } },
        ],
      },
    });

    // 5. Timeline
    const timeline = await prisma.timelineEvent.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: term } },
          { description: { contains: term } },
        ],
      },
    });

    // 6. Care directory
    const doctors = await prisma.doctor.findMany({
      where: {
        OR: [
          { name: { contains: term } },
          { specialization: { contains: term } },
        ],
      },
    });

    const hospitals = await prisma.hospital.findMany({
      where: {
        OR: [
          { name: { contains: term } },
          { address: { contains: term } },
        ],
      },
    });

    res.json({
      query: term,
      results: {
        documents,
        labs,
        medications,
        encounters,
        timeline,
        doctors,
        hospitals,
      },
      totalResults:
        documents.length +
        labs.length +
        medications.length +
        encounters.length +
        timeline.length +
        doctors.length +
        hospitals.length,
    });
  } catch (err) {
    next(err);
  }
});
