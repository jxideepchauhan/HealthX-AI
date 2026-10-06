import { Router } from 'express';
import { prisma } from '@healthx/database';
import { authMiddleware } from '../middleware/auth';
import {
  validateFHIRResource,
  parseFHIRResource,
  toFHIRPatient,
  toFHIRObservation,
  toFHIRMedicationRequest,
  FHIRBundle,
  AnyFHIRResource,
} from '@healthx/fhir';
import { AppError } from '@healthx/shared';

export const fhirRouter = Router();

fhirRouter.use(authMiddleware);

// GET /api/v1/fhir/Patient/:id
fhirRouter.get('/Patient/:id', async (req, res, next) => {
  try {
    if (req.params.id !== req.user!.userId) {
      throw new AppError('FORBIDDEN', 'Access to requested patient is forbidden', 403);
    }

    const patientUser = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: { profile: { include: { emergencyContacts: true } } },
    });

    if (!patientUser || !patientUser.profile) {
      throw new AppError('NOT_FOUND', 'FHIR Patient resource not found', 404);
    }

    const fhirPatient = toFHIRPatient({
      id: patientUser.id,
      name: patientUser.profile.name,
      dob: patientUser.profile.dob,
      sex: patientUser.profile.sex as any,
      preferredLanguage: patientUser.profile.preferredLanguage,
      location: patientUser.profile.location,
      bloodGroup: patientUser.profile.bloodGroup,
      heightCm: patientUser.profile.heightCm,
      weightKg: patientUser.profile.weightKg,
      emergencyContactName: patientUser.profile.emergencyContacts[0]?.name || '',
      emergencyContactRelation: patientUser.profile.emergencyContacts[0]?.relationship || '',
      emergencyContactPhone: patientUser.profile.emergencyContacts[0]?.phone || '',
      allergies: JSON.parse(patientUser.profile.allergiesJson || '[]'),
      importantMedicalInformation: patientUser.profile.importantMedicalInformation,
    });

    res.json(fhirPatient);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/fhir/Observation
fhirRouter.get('/Observation', async (req, res, next) => {
  try {
    const labs = await prisma.labResult.findMany({
      where: { userId: req.user!.userId },
    });

    const observations = labs.map((l) =>
      toFHIRObservation(
        {
          id: l.id,
          testName: l.testName,
          normalizedName: l.normalizedName || undefined,
          value: l.value,
          numericValue: l.numericValue || undefined,
          unit: l.unit,
          referenceLow: l.referenceLow || undefined,
          referenceHigh: l.referenceHigh || undefined,
          referenceText: l.referenceText || undefined,
          status: l.status as any,
          date: l.testDate,
          dataOrigin: l.dataOrigin as any,
          verificationStatus: l.verificationStatus as any,
        },
        req.user!.userId
      )
    );

    const bundle: FHIRBundle = {
      resourceType: 'Bundle',
      type: 'searchset',
      total: observations.length,
      entry: observations.map((o) => ({ resource: o })),
    };

    res.json(bundle);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/fhir/MedicationRequest
fhirRouter.get('/MedicationRequest', async (req, res, next) => {
  try {
    const meds = await prisma.medication.findMany({
      where: { userId: req.user!.userId },
    });

    const requests = meds.map((m) =>
      toFHIRMedicationRequest(
        {
          id: m.id,
          name: m.name,
          genericName: m.genericName || undefined,
          strength: m.strength || undefined,
          dosage: m.dosage || undefined,
          frequency: m.frequency || undefined,
          route: m.route || undefined,
          duration: m.duration || undefined,
          startDate: m.startDate || undefined,
          endDate: m.endDate || undefined,
          prescriber: m.prescriber || undefined,
          instructions: m.instructions || undefined,
          dataOrigin: m.dataOrigin as any,
          verificationStatus: m.verificationStatus as any,
          isActive: m.isActive,
        },
        req.user!.userId
      )
    );

    const bundle: FHIRBundle = {
      resourceType: 'Bundle',
      type: 'searchset',
      total: requests.length,
      entry: requests.map((r) => ({ resource: r })),
    };

    res.json(bundle);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/fhir/DiagnosticReport
fhirRouter.get('/DiagnosticReport', async (req, res, next) => {
  try {
    const docs = await prisma.document.findMany({
      where: { userId: req.user!.userId },
    });

    const reports = docs.map((d) => ({
      resourceType: 'DiagnosticReport',
      id: d.id,
      status: 'final',
      code: { text: d.title },
      subject: { reference: `Patient/${req.user!.userId}` },
      effectiveDateTime: d.createdAt.toISOString(),
    }));

    res.json({
      resourceType: 'Bundle',
      type: 'searchset',
      total: reports.length,
      entry: reports.map((r) => ({ resource: r as any })),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/fhir/export (Full FHIR export)
fhirRouter.get('/export', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: { include: { emergencyContacts: true } } },
    });

    const labs = await prisma.labResult.findMany({ where: { userId } });
    const meds = await prisma.medication.findMany({ where: { userId } });

    const entries: Array<{ resource: AnyFHIRResource }> = [];

    if (user?.profile) {
      entries.push({
        resource: toFHIRPatient({
          id: user.id,
          name: user.profile.name,
          dob: user.profile.dob,
          sex: user.profile.sex as any,
          preferredLanguage: user.profile.preferredLanguage,
          location: user.profile.location,
          bloodGroup: user.profile.bloodGroup,
          heightCm: user.profile.heightCm,
          weightKg: user.profile.weightKg,
          emergencyContactName: user.profile.emergencyContacts[0]?.name || '',
          emergencyContactRelation: user.profile.emergencyContacts[0]?.relationship || '',
          emergencyContactPhone: user.profile.emergencyContacts[0]?.phone || '',
          allergies: JSON.parse(user.profile.allergiesJson || '[]'),
          importantMedicalInformation: user.profile.importantMedicalInformation,
        }),
      });
    }

    for (const l of labs) {
      entries.push({
        resource: toFHIRObservation(
          {
            id: l.id,
            testName: l.testName,
            value: l.value,
            numericValue: l.numericValue || undefined,
            unit: l.unit,
            referenceLow: l.referenceLow || undefined,
            referenceHigh: l.referenceHigh || undefined,
            referenceText: l.referenceText || undefined,
            status: l.status as any,
            date: l.testDate,
            dataOrigin: l.dataOrigin as any,
            verificationStatus: l.verificationStatus as any,
          },
          userId
        ),
      });
    }

    for (const m of meds) {
      entries.push({
        resource: toFHIRMedicationRequest(
          {
            id: m.id,
            name: m.name,
            dosage: m.dosage || undefined,
            dataOrigin: m.dataOrigin as any,
            verificationStatus: m.verificationStatus as any,
            isActive: m.isActive,
          },
          userId
        ),
      });
    }

    const bundle: FHIRBundle = {
      resourceType: 'Bundle',
      type: 'collection',
      total: entries.length,
      entry: entries,
    };

    res.json(bundle);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/fhir/import (FHIR Resource Import)
fhirRouter.post('/import', async (req, res, next) => {
  try {
    const rawResource = req.body;
    const validated = validateFHIRResource(rawResource);
    const parsed = parseFHIRResource(validated);

    // Save FHIR resource
    await prisma.fHIRResource.create({
      data: {
        userId: req.user!.userId,
        resourceType: validated.resourceType,
        resourceId: validated.id,
        rawJson: JSON.stringify(validated),
      },
    });

    // Map to domain entity if Observation
    if (parsed.type === 'Observation') {
      const d = parsed.mappedData as any;
      await prisma.labResult.create({
        data: {
          userId: req.user!.userId,
          testName: d.testName,
          value: String(d.value),
          unit: d.unit || '',
          referenceLow: d.referenceLow,
          referenceHigh: d.referenceHigh,
          referenceText: d.referenceText,
          status: d.status,
          testDate: d.date.split('T')[0],
          dataOrigin: 'ABDM_IMPORTED',
          verificationStatus: 'SOURCE_VERIFIED',
        },
      });
    }

    res.status(201).json({
      message: `FHIR ${validated.resourceType} imported and normalized successfully.`,
      resourceId: validated.id,
    });
  } catch (err) {
    next(err);
  }
});
