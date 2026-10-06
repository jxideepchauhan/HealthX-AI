import { Router } from 'express';
import { prisma } from '@healthx/database';
import { authMiddleware } from '../middleware/auth';
import { requireRole, checkConsentAccess } from '../middleware/rbac';
import { AppError } from '@healthx/shared';
import { createAuditLog } from '@healthx/security';

export const hospitalRouter = Router();

hospitalRouter.use(authMiddleware);
hospitalRouter.use(requireRole('HOSPITAL', 'ADMIN'));

// GET /api/v1/hospital/dashboard
hospitalRouter.get('/dashboard', async (req, res, next) => {
  try {
    const hospitalUser = await prisma.user.findUnique({
      where: { id: req.user!.userId },
    });

    const doctors = await prisma.doctor.findMany({
      include: { hospital: true },
    });

    const activeConsents = await prisma.consent.findMany({
      where: { status: 'ACTIVE' },
      include: { patient: { include: { profile: true } } },
    });

    const documentsCount = await prisma.document.count();
    const auditCount = await prisma.auditEvent.count();

    res.json({
      hospital: {
        id: hospitalUser?.id,
        identifier: hospitalUser?.identifier,
        uniqueId: hospitalUser?.uniqueId || 'HOSP-NAMO-001',
        hospitalCode: hospitalUser?.hospitalCode || 'NABH-HOSP-2026-901',
        name: 'Namo Hospital & Research Center',
      },
      stats: {
        totalConsentedPatients: activeConsents.length,
        affiliatedDoctors: doctors.length,
        totalHospitalDocuments: documentsCount,
        institutionalAuditEntries: auditCount,
      },
      doctors: doctors.map((d) => ({
        id: d.id,
        name: d.name,
        specialization: d.specialization,
        email: d.email,
        phone: d.phone,
      })),
      recentConsents: activeConsents.slice(0, 5).map((c) => ({
        id: c.id,
        patientName: c.patient.profile?.name || c.patient.identifier,
        scope: c.scope,
        expiryDate: c.expiryDate,
      })),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/hospital/patients
hospitalRouter.get('/patients', async (req, res, next) => {
  try {
    const hospitalId = req.user!.userId;
    const now = new Date().toISOString();

    const consents = await prisma.consent.findMany({
      where: {
        OR: [{ recipientId: hospitalId }, { organizationId: hospitalId }, { status: 'ACTIVE' }],
        expiryDate: { gt: now },
      },
      include: {
        patient: { include: { profile: true } },
      },
    });

    const patients = consents.map((c) => ({
      consentId: c.id,
      patientId: c.patientId,
      name: c.patient.profile?.name || c.patient.identifier,
      uniqueId: c.patient.uniqueId,
      location: c.patient.profile?.location,
      bloodGroup: c.patient.profile?.bloodGroup,
      scope: c.scope,
      expiryDate: c.expiryDate,
    }));

    res.json({ patients });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/hospital/documents (Submit document on patient behalf)
hospitalRouter.post('/documents', async (req, res, next) => {
  try {
    const { patientId, title, textContent } = req.body;

    if (!patientId || !title || !textContent) {
      throw new AppError('VALIDATION_ERROR', 'patientId, title, and textContent are required.');
    }

    // Verify hospital has active consent from patient
    await checkConsentAccess(req, patientId, 'DOCUMENTS');

    const doc = await prisma.document.create({
      data: {
        userId: patientId,
        title: `${title} [HOSPITAL SUBMITTED]`,
        fileName: 'hospital_record.txt',
        fileType: 'TXT',
        mimeType: 'text/plain',
        fileSize: Buffer.byteLength(textContent),
        storageKey: `hospitals/${req.user!.userId}/patients/${patientId}/${Date.now()}.txt`,
        fileHash: 'hospital-hash-' + Date.now(),
        processingStatus: 'COMPLETED',
        pages: {
          create: [{ pageNumber: 1, textContent }],
        },
      },
    });

    // Create Audit Log
    const audit = createAuditLog(req.user!.userId, req.user!.role, 'CREATE', 'HospitalDocument', doc.id, 'SUCCESS');
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
      message: 'Hospital record registered under patient records with verified consent.',
      documentId: doc.id,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/hospital/doctors (List affiliated physicians)
hospitalRouter.get('/doctors', async (_req, res, next) => {
  try {
    const doctors = await prisma.doctor.findMany({
      include: { hospital: true },
    });
    res.json({ doctors });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/hospital/doctors (Onboard physician to hospital)
hospitalRouter.post('/doctors', async (req, res, next) => {
  try {
    const { name, specialization, email, phone } = req.body;
    if (!name || !specialization) {
      throw new AppError('VALIDATION_ERROR', 'Name and specialization are required.');
    }

    const doctor = await prisma.doctor.create({
      data: {
        name,
        specialization,
        email,
        phone,
      },
    });

    res.status(201).json({
      message: 'Physician onboarded to hospital roster.',
      doctor,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/hospital/consents (Institutional Consent Register)
hospitalRouter.get('/consents', async (_req, res, next) => {
  try {
    const consents = await prisma.consent.findMany({
      include: {
        patient: { include: { profile: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      consents: consents.map((c) => ({
        id: c.id,
        patientId: c.patientId,
        patientName: c.patient.profile?.name || c.patient.identifier,
        patientUniqueId: c.patient.uniqueId,
        recipientName: c.recipientName,
        recipientRole: c.recipientRole,
        scope: c.scope,
        purpose: c.purpose,
        startDate: c.startDate,
        expiryDate: c.expiryDate,
        status: c.status,
      })),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/hospital/audit (Tamper-evident hospital audit trail)
hospitalRouter.get('/audit', async (_req, res, next) => {
  try {
    const logs = await prisma.auditEvent.findMany({
      take: 50,
      orderBy: { timestamp: 'desc' },
      include: { user: { select: { identifier: true, uniqueId: true, role: true } } },
    });

    res.json({ logs });
  } catch (err) {
    next(err);
  }
});
