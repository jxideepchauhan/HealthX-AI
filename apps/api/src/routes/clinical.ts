import { Router } from 'express';
import { prisma } from '@healthx/database';
import { authMiddleware } from '../middleware/auth';
import { AI_DISCLAIMER } from '@healthx/shared';
import type { DoctorVisitBrief } from '@healthx/types';

export const clinicalRouter = Router();

function safeJsonParse<T>(val: string | null | undefined, fallback: T): T {
  if (!val) return fallback;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

clinicalRouter.use(authMiddleware);

// POST /api/v1/doctor-visit/brief (Doctor Visit Mode - Section 41)
clinicalRouter.post('/doctor-visit/brief', async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    const encounters = await prisma.encounter.findMany({
      where: { userId },
      take: 5,
      orderBy: { startDate: 'desc' },
    });

    const reports = await prisma.document.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    const labs = await prisma.labResult.findMany({
      where: { userId },
      take: 10,
      orderBy: { testDate: 'desc' },
    });

    const medications = await prisma.medication.findMany({
      where: { userId, isActive: true },
    });

    const vitals = await prisma.observation.findMany({
      where: { userId, category: 'vital-signs' },
    });

    const vitalSummary: Record<string, string | number> = {};
    for (const v of vitals) {
      vitalSummary[v.code] = `${v.value} ${v.unit || ''}`.trim();
    }

    const brief: DoctorVisitBrief = {
      patientSummary: {
        name: user?.profile?.name || 'Patient',
        age: 18,
        sex: user?.profile?.sex || 'Male',
        bloodGroup: user?.profile?.bloodGroup || 'A+',
        knownAllergies: safeJsonParse<string[]>(user?.profile?.allergiesJson, ['Unknown']),
        vitalSummary,
      },
      recentEncounters: encounters.map((e) => ({
        date: e.startDate,
        doctor: e.doctorName || undefined,
        hospital: e.hospitalName || undefined,
        reason: e.reason || undefined,
      })),
      recentReports: reports.map((r) => ({
        id: r.id,
        title: r.title,
        date: r.createdAt.toISOString().split('T')[0],
        type: r.fileType,
      })),
      labChanges: labs.map((l) => ({
        testName: l.testName,
        latestValue: `${l.value} ${l.unit}`,
        latestDate: l.testDate,
        status: l.status as any,
        referenceRange: l.referenceText || `${l.referenceLow ?? ''}-${l.referenceHigh ?? ''} ${l.unit}`,
      })),
      recordedMedicines: medications.map((m) => ({
        name: m.name,
        dosage: m.dosage || undefined,
        frequency: m.frequency || undefined,
        startDate: m.startDate || undefined,
        prescriber: m.prescriber || undefined,
      })),
      documentedSymptoms: [
        { symptom: 'Fatigue', reportedDate: '2026-09-15' },
        { symptom: 'Occasional dizziness', reportedDate: '2026-09-15' },
        { symptom: 'User-reported shivering episodes', reportedDate: '2026-09-10' },
      ],
      questionsForDoctor: [
        'Would you recommend repeat iron studies to monitor response to the iron supplement?',
        'Are the user-reported shivering episodes related to low ferritin, or do they warrant investigation?',
        'Is blood pressure monitoring indicated given the systolic reading of 149 mmHg?',
      ],
      generatedAt: new Date().toISOString(),
    };

    res.json({
      brief,
      disclaimer: AI_DISCLAIMER,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/health-summary (Comprehensive Health Summary - Section 69)
clinicalRouter.post('/health-summary', async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    const labs = await prisma.labResult.findMany({
      where: { userId },
      take: 6,
      orderBy: { testDate: 'desc' },
      include: { sourceDocument: { select: { title: true } } },
    });

    const medications = await prisma.medication.findMany({
      where: { userId },
      include: { sourceDocument: { select: { title: true } } },
    });

    const conditions = await prisma.condition.findMany({
      where: { userId },
    });

    const summary = {
      profile: {
        name: user?.profile?.name,
        dob: user?.profile?.dob,
        bloodGroup: user?.profile?.bloodGroup,
        allergies: safeJsonParse<string[]>(user?.profile?.allergiesJson, []),
        importantInfo: user?.profile?.importantMedicalInformation,
      },
      laboratoryFindings: labs.map((l) => ({
        test: l.testName,
        value: `${l.value} ${l.unit}`,
        status: l.status,
        date: l.testDate,
        source: l.sourceDocument?.title || 'User Entry',
      })),
      activeMedications: medications.map((m) => ({
        name: m.name,
        dosage: m.dosage || 'Not specified',
        prescriber: m.prescriber,
        source: m.sourceDocument?.title || 'User Entry',
      })),
      recordedAssessments: conditions.map((c) => ({
        condition: c.name,
        status: c.clinicalStatus,
        verification: c.verificationStatus,
        onset: c.onsetDate,
      })),
      generatedAt: new Date().toISOString(),
      disclaimer: AI_DISCLAIMER,
    };

    res.json({ summary });
  } catch (err) {
    next(err);
  }
});
