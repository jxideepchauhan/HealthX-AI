import { PrismaClient } from '@prisma/client';
import crypto from 'node:crypto';

const prisma = new PrismaClient();

function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

async function main() {
  console.log('--- Seeding HealthX AI Database ---');

  const patientSalt = generateSalt();
  const patientHash = hashPassword('Patient@123', patientSalt);

  const doctorSalt = generateSalt();
  const doctorHash = hashPassword('Doctor@123', doctorSalt);

  const hospitalSalt = generateSalt();
  const hospitalHash = hashPassword('Hospital@123', hospitalSalt);

  // 1. Create Patient User (Isaac Richard Noronha)
  const patient = await prisma.user.upsert({
    where: { identifier: 'isaac.noronha@example.com' },
    update: {
      uniqueId: 'PAT-ISAAC-1001',
      passwordHash: patientHash,
      passwordSalt: patientSalt,
    },
    create: {
      id: 'patient-isaac-noronha-2026',
      identifier: 'isaac.noronha@example.com',
      uniqueId: 'PAT-ISAAC-1001',
      passwordHash: patientHash,
      passwordSalt: patientSalt,
      role: 'PATIENT',
      profile: {
        create: {
          name: 'Isaac Richard Noronha',
          dob: '2008-08-30',
          sex: 'Male',
          preferredLanguage: 'English',
          location: 'Himachal Pradesh',
          bloodGroup: 'A+',
          heightCm: 180,
          weightKg: 85,
          allergiesJson: JSON.stringify(['Unknown']),
          importantMedicalInformation: 'None reported. User has reported shivering episodes.',
          regularDoctor: 'Dr. Raskik',
          regularHospital: 'Namo Hospital',
          sleepHours: '5-6 hours',
          exerciseHabits: 'Gym/running',
          dailySteps: 7000,
          emergencyContacts: {
            create: [
              {
                name: 'Father',
                relationship: 'Father',
                phone: '+91-9876543210',
              },
            ],
          },
        },
      },
    },
  });

  console.log(`Seeded Patient: ${patient.identifier} (Unique ID: PAT-ISAAC-1001)`);

  // 2. Create Doctor & Hospital
  const hospital = await prisma.hospital.upsert({
    where: { id: 'hospital-namo-001' },
    update: {},
    create: {
      id: 'hospital-namo-001',
      name: 'Namo Hospital',
      address: 'Himachal Pradesh, India',
      phone: '+91-177-2800000',
      email: 'care@namohospital.org',
    },
  });

  await prisma.doctor.upsert({
    where: { id: 'doctor-raskik-001' },
    update: {},
    create: {
      id: 'doctor-raskik-001',
      name: 'Dr. Raskik',
      specialization: 'Internal Medicine',
      phone: '+91-9816000000',
      email: 'dr.raskik@namohospital.org',
      hospitalId: hospital.id,
    },
  });

  // Doctor User Account for Doctor Portal
  const doctorUser = await prisma.user.upsert({
    where: { identifier: 'dr.raskik@namohospital.org' },
    update: {
      uniqueId: 'DOC-RASKIK-4091',
      doctorLicense: 'MCI-2024-88492',
      passwordHash: doctorHash,
      passwordSalt: doctorSalt,
    },
    create: {
      id: 'user-doctor-raskik',
      identifier: 'dr.raskik@namohospital.org',
      uniqueId: 'DOC-RASKIK-4091',
      doctorLicense: 'MCI-2024-88492',
      passwordHash: doctorHash,
      passwordSalt: doctorSalt,
      role: 'DOCTOR',
    },
  });

  console.log(`Seeded Doctor: ${doctorUser.identifier} (Unique ID: DOC-RASKIK-4091)`);

  // Hospital User Account for Hospital Portal
  const hospitalUser = await prisma.user.upsert({
    where: { identifier: 'admin@namohospital.org' },
    update: {
      uniqueId: 'HOSP-NAMO-001',
      hospitalCode: 'NABH-HOSP-2026-901',
      passwordHash: hospitalHash,
      passwordSalt: hospitalSalt,
    },
    create: {
      id: 'user-hospital-namo',
      identifier: 'admin@namohospital.org',
      uniqueId: 'HOSP-NAMO-001',
      hospitalCode: 'NABH-HOSP-2026-901',
      passwordHash: hospitalHash,
      passwordSalt: hospitalSalt,
      role: 'HOSPITAL',
    },
  });

  console.log(`Seeded Hospital: ${hospitalUser.identifier} (Unique ID: HOSP-NAMO-001)`);

  // Clean previous synthetic child data for clean idempotency
  await prisma.auditEvent.deleteMany({ where: { userId: patient.id } });
  await prisma.embedding.deleteMany({ where: { userId: patient.id } });
  await prisma.consent.deleteMany({ where: { patientId: patient.id } });
  await prisma.timelineEvent.deleteMany({ where: { userId: patient.id } });
  await prisma.condition.deleteMany({ where: { userId: patient.id } });
  await prisma.encounter.deleteMany({ where: { userId: patient.id } });
  await prisma.medication.deleteMany({ where: { userId: patient.id } });
  await prisma.labResult.deleteMany({ where: { userId: patient.id } });
  await prisma.document.deleteMany({ where: { id: 'doc-cbc-iron-studies-2026' } });
  await prisma.observation.deleteMany({ where: { userId: patient.id } });

  // 3. User Reported Vitals / Observations (Provenance: USER_PROVIDED)
  await prisma.observation.createMany({
    data: [
      {
        userId: patient.id,
        category: 'vital-signs',
        code: 'SpO2',
        value: '98%',
        unit: '%',
        effectiveDate: '2026-09-10',
        dataOrigin: 'USER_PROVIDED',
      },
      {
        userId: patient.id,
        category: 'vital-signs',
        code: 'Heart Rate',
        value: '74 bpm (Reported Normal)',
        unit: 'bpm',
        effectiveDate: '2026-09-10',
        dataOrigin: 'USER_PROVIDED',
      },
      {
        userId: patient.id,
        category: 'vital-signs',
        code: 'Blood Pressure',
        value: 'Highest systolic 149 mmHg (Complete readings unavailable)',
        unit: 'mmHg',
        effectiveDate: '2026-09-10',
        dataOrigin: 'USER_PROVIDED',
      },
    ],
  });

  // 4. Synthetic Document: "CBC + Iron Studies" (Provenance: SYNTHETIC_TEST)
  const syntheticDoc = await prisma.document.create({
    data: {
      id: 'doc-cbc-iron-studies-2026',
      userId: patient.id,
      title: 'CBC + Iron Studies [SYNTHETIC TEST DATA]',
      fileName: 'cbc_iron_studies_synthetic.pdf',
      fileType: 'PDF',
      mimeType: 'application/pdf',
      fileSize: 142850,
      storageKey: 'synthetic/cbc_iron_studies_synthetic.pdf',
      fileHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      processingStatus: 'COMPLETED',
      pages: {
        create: [
          {
            pageNumber: 1,
            textContent:
              'NAMO HOSPITAL - LABORATORY SERVICES\nDate: 15 September 2026\nPatient: Isaac Richard Noronha\nPhysician: Dr. Raskik\nTest: Complete Blood Count & Iron Studies\n[SYNTHETIC TEST DATA]\nHemoglobin: 10.8 g/dL (Reference: 13.0 - 17.0)\nRBC: 4.1 million/µL (Reference: 4.5 - 5.9)\nFerritin: 12 ng/mL (Reference: 30 - 400)\nMCV: 76 fL (Reference: 80 - 100)\nWBC: 7200 /µL (Reference: 4000 - 11000)\nPlatelets: 310000 /µL (Reference: 150000 - 450000)\nClinical Assessment: Possible iron-deficiency anemia\nRx: Iron supplement as prescribed',
          },
        ],
      },
      ocrResult: {
        create: {
          fullText:
            'NAMO HOSPITAL - LABORATORY SERVICES\nDate: 15 September 2026\nPatient: Isaac Richard Noronha\nPhysician: Dr. Raskik\nTest: Complete Blood Count & Iron Studies\n[SYNTHETIC TEST DATA]\nHemoglobin: 10.8 g/dL (Reference: 13.0 - 17.0)\nRBC: 4.1 million/µL (Reference: 4.5 - 5.9)\nFerritin: 12 ng/mL (Reference: 30 - 400)\nMCV: 76 fL (Reference: 80 - 100)\nWBC: 7200 /µL (Reference: 4000 - 11000)\nPlatelets: 310000 /µL (Reference: 150000 - 450000)\nClinical Assessment: Possible iron-deficiency anemia\nRx: Iron supplement as prescribed',
          confidence: 0.98,
          language: 'en',
          isHandwritten: false,
          handwritingConfidence: 0.05,
        },
      },
      extractedEntities: {
        create: [
          {
            entityType: 'LAB_TEST',
            value: '10.8',
            normalizedValue: 'Hemoglobin',
            confidence: 0.99,
            pageNumber: 1,
            verificationStatus: 'SOURCE_VERIFIED',
          },
          {
            entityType: 'LAB_TEST',
            value: '12',
            normalizedValue: 'Serum Ferritin',
            confidence: 0.98,
            pageNumber: 1,
            verificationStatus: 'SOURCE_VERIFIED',
          },
          {
            entityType: 'MEDICATION',
            value: 'Iron supplement',
            normalizedValue: 'Iron supplement',
            confidence: 0.96,
            pageNumber: 1,
            verificationStatus: 'SOURCE_VERIFIED',
          },
        ],
      },
    },
  });

  // 5. Seed Synthetic Laboratory Values (Section 93)
  await prisma.labResult.createMany({
    data: [
      {
        userId: patient.id,
        testName: 'Hemoglobin',
        normalizedName: 'Hemoglobin',
        value: '10.8',
        numericValue: 10.8,
        unit: 'g/dL',
        referenceLow: 13.0,
        referenceHigh: 17.0,
        referenceText: '13.0 - 17.0 g/dL',
        status: 'LOW',
        testDate: '2026-09-15',
        sourceDocumentId: syntheticDoc.id,
        pageNumber: 1,
        dataOrigin: 'SYNTHETIC_TEST',
        verificationStatus: 'SOURCE_VERIFIED',
      },
      {
        userId: patient.id,
        testName: 'RBC',
        normalizedName: 'Red Blood Cell Count',
        value: '4.1',
        numericValue: 4.1,
        unit: 'million/µL',
        referenceLow: 4.5,
        referenceHigh: 5.9,
        referenceText: '4.5 - 5.9 million/µL',
        status: 'LOW',
        testDate: '2026-09-15',
        sourceDocumentId: syntheticDoc.id,
        pageNumber: 1,
        dataOrigin: 'SYNTHETIC_TEST',
        verificationStatus: 'SOURCE_VERIFIED',
      },
      {
        userId: patient.id,
        testName: 'Ferritin',
        normalizedName: 'Serum Ferritin',
        value: '12',
        numericValue: 12,
        unit: 'ng/mL',
        referenceLow: 30.0,
        referenceHigh: 400.0,
        referenceText: '30 - 400 ng/mL',
        status: 'LOW',
        testDate: '2026-09-15',
        sourceDocumentId: syntheticDoc.id,
        pageNumber: 1,
        dataOrigin: 'SYNTHETIC_TEST',
        verificationStatus: 'SOURCE_VERIFIED',
      },
      {
        userId: patient.id,
        testName: 'MCV',
        normalizedName: 'Mean Corpuscular Volume',
        value: '76',
        numericValue: 76,
        unit: 'fL',
        referenceLow: 80.0,
        referenceHigh: 100.0,
        referenceText: '80 - 100 fL',
        status: 'LOW',
        testDate: '2026-09-15',
        sourceDocumentId: syntheticDoc.id,
        pageNumber: 1,
        dataOrigin: 'SYNTHETIC_TEST',
        verificationStatus: 'SOURCE_VERIFIED',
      },
      {
        userId: patient.id,
        testName: 'WBC',
        normalizedName: 'White Blood Cell Count',
        value: '7200',
        numericValue: 7200,
        unit: '/µL',
        referenceLow: 4000.0,
        referenceHigh: 11000.0,
        referenceText: '4000 - 11000 /µL',
        status: 'NORMAL',
        testDate: '2026-09-15',
        sourceDocumentId: syntheticDoc.id,
        pageNumber: 1,
        dataOrigin: 'SYNTHETIC_TEST',
        verificationStatus: 'SOURCE_VERIFIED',
      },
      {
        userId: patient.id,
        testName: 'Platelets',
        normalizedName: 'Platelet Count',
        value: '310000',
        numericValue: 310000,
        unit: '/µL',
        referenceLow: 150000.0,
        referenceHigh: 450000.0,
        referenceText: '150000 - 450000 /µL',
        status: 'NORMAL',
        testDate: '2026-09-15',
        sourceDocumentId: syntheticDoc.id,
        pageNumber: 1,
        dataOrigin: 'SYNTHETIC_TEST',
        verificationStatus: 'SOURCE_VERIFIED',
      },
    ],
  });

  // 6. Synthetic Medication (Section 93: Iron supplement, no invented dosage)
  await prisma.medication.create({
    data: {
      userId: patient.id,
      name: 'Iron supplement',
      prescriber: 'Dr. Raskik',
      hospital: 'Namo Hospital',
      startDate: '2026-09-15',
      sourceDocumentId: syntheticDoc.id,
      dataOrigin: 'SYNTHETIC_TEST',
      verificationStatus: 'SOURCE_VERIFIED',
      isActive: true,
      instructions: 'As directed by physician on report (Dosage not specified)',
    },
  });

  // 7. Synthetic Encounter & Assessment
  await prisma.encounter.create({
    data: {
      userId: patient.id,
      encounterType: 'CONSULTATION',
      doctorName: 'Dr. Raskik',
      hospitalName: 'Namo Hospital',
      startDate: '2026-09-15',
      reason: 'Fatigue and occasional dizziness [SYNTHETIC TEST]',
    },
  });

  await prisma.condition.create({
    data: {
      userId: patient.id,
      name: 'Possible iron-deficiency anemia',
      clinicalStatus: 'active',
      verificationStatus: 'unconfirmed',
      onsetDate: '2026-09-15',
      dataOrigin: 'SYNTHETIC_TEST',
    },
  });

  // 8. Timeline Events
  await prisma.timelineEvent.createMany({
    data: [
      {
        userId: patient.id,
        eventType: 'CONSULTATION',
        title: 'Consultation with Dr. Raskik',
        description: 'Reported symptoms: Fatigue, occasional dizziness at Namo Hospital.',
        eventDate: '2026-09-15',
        sourceDocumentId: syntheticDoc.id,
        dataOrigin: 'SYNTHETIC_TEST',
      },
      {
        userId: patient.id,
        eventType: 'LAB',
        title: 'CBC + Iron Studies',
        description: 'Hemoglobin 10.8 g/dL (Low), Ferritin 12 ng/mL (Low).',
        eventDate: '2026-09-15',
        sourceDocumentId: syntheticDoc.id,
        dataOrigin: 'SYNTHETIC_TEST',
      },
      {
        userId: patient.id,
        eventType: 'PRESCRIPTION',
        title: 'Iron supplement prescribed',
        description: 'Documented prescription by Dr. Raskik without explicit dosage.',
        eventDate: '2026-09-15',
        sourceDocumentId: syntheticDoc.id,
        dataOrigin: 'SYNTHETIC_TEST',
      },
    ],
  });

  // 9. Active Consent: Patient granted to Dr. Raskik
  await prisma.consent.create({
    data: {
      patientId: patient.id,
      recipientId: doctorUser.id,
      recipientName: 'Dr. Raskik',
      recipientRole: 'DOCTOR',
      organizationId: hospital.id,
      organizationName: 'Namo Hospital',
      scope: 'ALL',
      startDate: '2026-09-15T00:00:00.000Z',
      expiryDate: '2027-09-15T00:00:00.000Z',
      status: 'ACTIVE',
      purpose: 'Ongoing clinical care and health monitoring',
    },
  });

  // Active Institutional Consent: Patient granted to Namo Hospital
  await prisma.consent.create({
    data: {
      patientId: patient.id,
      recipientId: hospitalUser.id,
      recipientName: 'Namo Hospital Admin',
      recipientRole: 'HOSPITAL',
      organizationId: hospital.id,
      organizationName: 'Namo Hospital & Research Center',
      scope: 'ALL',
      startDate: '2026-09-15T00:00:00.000Z',
      expiryDate: '2027-09-15T00:00:00.000Z',
      status: 'ACTIVE',
      purpose: 'Institutional EHR record management and diagnostics',
    },
  });

  // 10. Embedding for RAG
  await prisma.embedding.create({
    data: {
      userId: patient.id,
      documentId: syntheticDoc.id,
      chunkId: `${syntheticDoc.id}-p1-c0`,
      chunkText:
        'NAMO HOSPITAL - LABORATORY SERVICES. Date: 15 September 2026. Hemoglobin: 10.8 g/dL (Reference: 13.0 - 17.0). Ferritin: 12 ng/mL. Iron supplement prescribed by Dr. Raskik.',
      vectorJson: JSON.stringify(new Array(64).fill(0.05)), // Mock 64-dim vector
    },
  });

  // 11. Initial Audit Trail
  await prisma.auditEvent.create({
    data: {
      userId: patient.id,
      userRole: 'PATIENT',
      action: 'CREATE',
      resource: 'UserProfile',
      resourceId: patient.id,
      result: 'SUCCESS',
      hash: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
      previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
      timestamp: new Date().toISOString(),
    },
  });

  console.log('--- HealthX AI Seed Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
