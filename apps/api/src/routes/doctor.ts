import { Router } from 'express';
import { prisma } from '@healthx/database';
import { authMiddleware } from '../middleware/auth';
import { requireRole, checkConsentAccess } from '../middleware/rbac';
import {
  AppError,
  DoctorPrescriptionSchema,
  DoctorClinicalNoteSchema,
  DoctorLabOrderSchema,
} from '@healthx/shared';
import { createAuditLog } from '@healthx/security';

export const doctorRouter = Router();

doctorRouter.use(authMiddleware);
doctorRouter.use(requireRole('DOCTOR', 'ADMIN'));

// GET /api/v1/doctor/dashboard (Clinical overview for logged-in physician)
doctorRouter.get('/dashboard', async (req, res, next) => {
  try {
    const doctorId = req.user!.userId;
    const now = new Date().toISOString();

    const activeConsents = await prisma.consent.findMany({
      where: {
        recipientId: doctorId,
        status: 'ACTIVE',
        expiryDate: { gt: now },
      },
      include: {
        patient: {
          include: {
            profile: true,
            labResults: { where: { status: { in: ['LOW', 'HIGH', 'CRITICAL'] } }, take: 3 },
            medications: { where: { isActive: true }, take: 5 },
          },
        },
      },
    });

    const patientIds = activeConsents.map((c) => c.patientId);

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: { in: patientIds },
        status: { in: ['SCHEDULED', 'CONFIRMED'] },
      },
      take: 10,
    });

    // Compile critical alerts
    const alerts: any[] = [];
    for (const c of activeConsents) {
      for (const lab of c.patient.labResults) {
        alerts.push({
          patientId: c.patientId,
          patientName: c.patient.profile?.name || c.patient.identifier,
          testName: lab.testName,
          value: lab.value,
          unit: lab.unit,
          status: lab.status,
          date: lab.testDate,
        });
      }
    }

    res.json({
      doctor: {
        id: req.user!.userId,
        identifier: req.user!.identifier,
      },
      stats: {
        activeConsentedPatients: activeConsents.length,
        criticalAlertsCount: alerts.length,
        scheduledAppointments: appointments.length,
      },
      patients: activeConsents.map((c) => ({
        consentId: c.id,
        patientId: c.patientId,
        name: c.patient.profile?.name || c.patient.identifier,
        dob: c.patient.profile?.dob,
        sex: c.patient.profile?.sex,
        bloodGroup: c.patient.profile?.bloodGroup,
        scope: c.scope,
        expiryDate: c.expiryDate,
        activeMedicationsCount: c.patient.medications.length,
      })),
      alerts,
      appointments,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/doctor/patients (Patients with active consent for this doctor)
doctorRouter.get('/patients', async (req, res, next) => {
  try {
    const doctorId = req.user!.userId;
    const now = new Date().toISOString();

    const consents = await prisma.consent.findMany({
      where: {
        recipientId: doctorId,
        status: 'ACTIVE',
        expiryDate: { gt: now },
      },
      include: {
        patient: {
          include: { profile: true },
        },
      },
    });

    const patients = consents.map((c) => ({
      consentId: c.id,
      patientId: c.patientId,
      name: c.patient.profile?.name || c.patient.identifier,
      dob: c.patient.profile?.dob,
      sex: c.patient.profile?.sex,
      bloodGroup: c.patient.profile?.bloodGroup,
      consentScope: c.scope,
      consentExpiry: c.expiryDate,
    }));

    res.json({ patients });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/doctor/patients/:id (Access authorized patient records)
doctorRouter.get('/patients/:id', async (req, res, next) => {
  try {
    const patientId = req.params.id;

    // Check active consent
    await checkConsentAccess(req, patientId, 'ALL');

    const patient = await prisma.user.findUnique({
      where: { id: patientId },
      include: {
        profile: { include: { emergencyContacts: true } },
        documents: {
          select: { id: true, title: true, fileName: true, fileType: true, createdAt: true },
        },
        labResults: { orderBy: { testDate: 'desc' } },
        medications: { orderBy: { createdAt: 'desc' } },
        timelineEvents: { orderBy: { eventDate: 'desc' } },
        encounters: { orderBy: { startDate: 'desc' } },
      },
    });

    if (!patient) {
      throw new AppError('NOT_FOUND', 'Patient record not found', 404);
    }

    res.json({
      patient: {
        id: patient.id,
        identifier: patient.identifier,
        uniqueId: patient.uniqueId,
        profile: patient.profile,
        documents: patient.documents,
        labResults: patient.labResults,
        medications: patient.medications,
        timelineEvents: patient.timelineEvents,
        encounters: patient.encounters,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/doctor/prescriptions (Issue official doctor prescription)
doctorRouter.post('/prescriptions', async (req, res, next) => {
  try {
    const data = DoctorPrescriptionSchema.parse(req.body);

    await checkConsentAccess(req, data.patientId, 'MEDICATIONS');

    const doctorProfile = await prisma.profile.findUnique({
      where: { userId: req.user!.userId },
    });
    const prescriberName = doctorProfile?.name || 'Dr. Raskik';

    const startDate = data.startDate || new Date().toISOString().split('T')[0];

    const medication = await prisma.medication.create({
      data: {
        userId: data.patientId,
        name: data.name,
        dosage: data.dosage,
        frequency: data.frequency,
        instructions: data.instructions,
        prescriber: prescriberName,
        startDate,
        endDate: data.endDate,
        isActive: true,
        verificationStatus: 'SOURCE_VERIFIED',
        dataOrigin: 'HOSPITAL_PROVIDED',
      },
    });

    // Create corresponding Timeline event
    await prisma.timelineEvent.create({
      data: {
        userId: data.patientId,
        eventType: 'PRESCRIPTION',
        title: `Prescribed ${data.name}`,
        description: `${data.dosage || ''} ${data.frequency || ''} - ${data.instructions}. Prescribed by ${prescriberName}.`,
        eventDate: startDate,
        dataOrigin: 'HOSPITAL_PROVIDED',
      },
    });

    // Audit log
    const audit = createAuditLog(req.user!.userId, req.user!.role, 'CREATE', 'Medication', medication.id, 'SUCCESS');
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

    res.status(201).json({
      message: 'Prescription recorded successfully in patient health chart.',
      medication,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/doctor/clinical-notes (Record clinical encounter & assessment)
doctorRouter.post('/clinical-notes', async (req, res, next) => {
  try {
    const data = DoctorClinicalNoteSchema.parse(req.body);

    await checkConsentAccess(req, data.patientId, 'CONSULTATIONS');

    const doctorProfile = await prisma.profile.findUnique({
      where: { userId: req.user!.userId },
    });
    const doctorName = doctorProfile?.name || 'Dr. Raskik';
    const noteDate = data.date || new Date().toISOString().split('T')[0];

    const encounter = await prisma.encounter.create({
      data: {
        userId: data.patientId,
        encounterType: data.encounterType,
        doctorName,
        reason: data.reason,
        startDate: noteDate,
      },
    });

    // If assessment contains diagnosis, log condition
    if (data.assessment) {
      await prisma.condition.create({
        data: {
          userId: data.patientId,
          name: data.assessment,
          clinicalStatus: 'active',
          verificationStatus: 'confirmed',
          onsetDate: noteDate,
          dataOrigin: 'HOSPITAL_PROVIDED',
        },
      });
    }

    // Create Timeline event
    await prisma.timelineEvent.create({
      data: {
        userId: data.patientId,
        eventType: 'CONSULTATION',
        title: `Clinical Consultation with ${doctorName}`,
        description: `Chief Complaint: ${data.reason}. Assessment: ${data.assessment}. ${data.plan ? `Plan: ${data.plan}` : ''}`,
        eventDate: noteDate,
        dataOrigin: 'HOSPITAL_PROVIDED',
      },
    });

    const audit = createAuditLog(req.user!.userId, req.user!.role, 'CREATE', 'Encounter', encounter.id, 'SUCCESS');
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

    res.status(201).json({
      message: 'Clinical encounter and consultation notes logged successfully.',
      encounter,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/doctor/lab-orders (Order clinical diagnostic test)
doctorRouter.post('/lab-orders', async (req, res, next) => {
  try {
    const data = DoctorLabOrderSchema.parse(req.body);

    await checkConsentAccess(req, data.patientId, 'LABS');

    const today = new Date().toISOString().split('T')[0];
    const orderTitle = `Diagnostic Order: ${data.testNames.join(', ')} (${data.priority})`;

    const report = await prisma.diagnosticReport.create({
      data: {
        userId: data.patientId,
        code: data.priority,
        title: orderTitle,
        status: 'registered',
        effectiveDate: today,
      },
    });

    await prisma.timelineEvent.create({
      data: {
        userId: data.patientId,
        eventType: 'LAB',
        title: orderTitle,
        description: `Ordered by physician. Priority: ${data.priority}. Notes: ${data.clinicalNotes || 'None'}.`,
        eventDate: today,
        dataOrigin: 'HOSPITAL_PROVIDED',
      },
    });

    res.status(201).json({
      message: 'Laboratory investigation order created.',
      order: report,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/doctor/consent-requests (Initiate consent request for a patient)
doctorRouter.post('/consent-requests', async (req, res, next) => {
  try {
    const { patientIdentifier, scope, purpose } = req.body;

    if (!patientIdentifier) {
      throw new AppError('VALIDATION_ERROR', 'Patient Email, Phone, or Unique ID is required.');
    }

    const patient = await prisma.user.findFirst({
      where: {
        OR: [
          { identifier: patientIdentifier },
          { uniqueId: patientIdentifier },
          { identifier: patientIdentifier.toLowerCase() },
          { uniqueId: patientIdentifier.toUpperCase() },
        ],
      },
      include: { profile: true },
    });

    if (!patient) {
      throw new AppError('NOT_FOUND', `No patient found with identifier "${patientIdentifier}".`, 404);
    }

    const now = new Date();
    const expiry = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days

    const consent = await prisma.consent.create({
      data: {
        patientId: patient.id,
        recipientId: req.user!.userId,
        recipientName: 'Dr. Raskik',
        recipientRole: 'DOCTOR',
        organizationName: 'Namo Hospital',
        scope: scope || 'ALL',
        startDate: now.toISOString(),
        expiryDate: expiry.toISOString(),
        status: 'ACTIVE',
        purpose: purpose || 'Ongoing clinical review and consultation',
      },
    });

    res.status(201).json({
      message: `Consent successfully authorized for patient ${patient.profile?.name || patient.identifier}.`,
      consent,
    });
  } catch (err) {
    next(err);
  }
});
