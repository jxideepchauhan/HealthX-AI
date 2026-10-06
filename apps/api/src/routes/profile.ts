import { Router } from 'express';
import { prisma } from '@healthx/database';
import { authMiddleware } from '../middleware/auth';
import { ProfileUpdateSchema } from '@healthx/shared';
import { createAuditLog } from '@healthx/security';

export const profileRouter = Router();

profileRouter.use(authMiddleware);

// GET /api/v1/profile
profileRouter.get('/', async (req, res, next) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user!.userId },
      include: { emergencyContacts: true },
    });

    if (!profile) {
      res.json({ profile: null });
      return;
    }

    res.json({
      profile: {
        ...profile,
        allergies: JSON.parse(profile.allergiesJson || '[]'),
      },
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/profile
profileRouter.patch('/', async (req, res, next) => {
  try {
    const data = ProfileUpdateSchema.parse(req.body);

    const updatePayload: Record<string, any> = {};
    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.dob !== undefined) updatePayload.dob = data.dob;
    if (data.sex !== undefined) updatePayload.sex = data.sex;
    if (data.preferredLanguage !== undefined) updatePayload.preferredLanguage = data.preferredLanguage;
    if (data.location !== undefined) updatePayload.location = data.location;
    if (data.bloodGroup !== undefined) updatePayload.bloodGroup = data.bloodGroup;
    if (data.heightCm !== undefined) updatePayload.heightCm = data.heightCm;
    if (data.weightKg !== undefined) updatePayload.weightKg = data.weightKg;
    if (data.allergies !== undefined) updatePayload.allergiesJson = JSON.stringify(data.allergies);
    if (data.importantMedicalInformation !== undefined) updatePayload.importantMedicalInformation = data.importantMedicalInformation;
    if (data.regularDoctor !== undefined) updatePayload.regularDoctor = data.regularDoctor;
    if (data.regularHospital !== undefined) updatePayload.regularHospital = data.regularHospital;
    if (data.sleepHours !== undefined) updatePayload.sleepHours = data.sleepHours;
    if (data.exerciseHabits !== undefined) updatePayload.exerciseHabits = data.exerciseHabits;
    if (data.dailySteps !== undefined) updatePayload.dailySteps = data.dailySteps;

    const profile = await prisma.profile.upsert({
      where: { userId: req.user!.userId },
      update: updatePayload,
      create: {
        userId: req.user!.userId,
        name: data.name || 'User',
        dob: data.dob || '2000-01-01',
        sex: data.sex || 'Male',
        location: data.location || 'Unknown',
        bloodGroup: data.bloodGroup || 'O+',
        heightCm: data.heightCm || 175,
        weightKg: data.weightKg || 70,
        ...updatePayload,
      },
    });

    // Handle emergency contacts
    if (data.emergencyContactName && data.emergencyContactPhone) {
      await prisma.emergencyContact.deleteMany({
        where: { profileId: profile.id },
      });
      await prisma.emergencyContact.create({
        data: {
          profileId: profile.id,
          name: data.emergencyContactName,
          relationship: data.emergencyContactRelation || 'Contact',
          phone: data.emergencyContactPhone,
        },
      });
    }

    // Audit log
    const audit = createAuditLog(req.user!.userId, req.user!.role, 'UPDATE', 'Profile', profile.id, 'SUCCESS');
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

    res.json({
      message: 'Profile updated successfully',
      profile: {
        ...profile,
        allergies: JSON.parse(profile.allergiesJson || '[]'),
      },
    });
  } catch (err) {
    next(err);
  }
});
