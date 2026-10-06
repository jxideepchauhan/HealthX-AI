import { Router } from 'express';
import { prisma } from '@healthx/database';
import { authMiddleware } from '../middleware/auth';
import { CreateAppointmentSchema, AppError } from '@healthx/shared';

export const appointmentsRouter = Router();

appointmentsRouter.use(authMiddleware);

// GET /api/v1/appointments
appointmentsRouter.get('/', async (req, res, next) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { userId: req.user!.userId },
      orderBy: { appointmentDate: 'asc' },
    });

    res.json({ appointments });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/appointments
appointmentsRouter.post('/', async (req, res, next) => {
  try {
    const data = CreateAppointmentSchema.parse(req.body);

    const appt = await prisma.appointment.create({
      data: {
        userId: req.user!.userId,
        doctorName: data.doctorName,
        hospitalName: data.hospitalName,
        appointmentDate: data.appointmentDate,
        reason: data.reason,
        notes: data.notes,
        status: 'SCHEDULED',
      },
    });

    res.status(201).json({ appointment: appt });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/appointments/:id
appointmentsRouter.patch('/:id', async (req, res, next) => {
  try {
    const appt = await prisma.appointment.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
    });

    if (!appt) {
      throw new AppError('NOT_FOUND', 'Appointment not found', 404);
    }

    const updated = await prisma.appointment.update({
      where: { id: appt.id },
      data: req.body,
    });

    res.json({ appointment: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/appointments/:id
appointmentsRouter.delete('/:id', async (req, res, next) => {
  try {
    const appt = await prisma.appointment.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
    });

    if (!appt) {
      throw new AppError('NOT_FOUND', 'Appointment not found', 404);
    }

    await prisma.appointment.delete({ where: { id: appt.id } });
    res.json({ message: 'Appointment cancelled and removed.' });
  } catch (err) {
    next(err);
  }
});
