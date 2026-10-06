/**
 * HealthX AI - Comprehensive Fixed Demo Data & Mock Provider
 * 
 * Provides permanent, offline-capable, self-contained mock data
 * for Patient, Doctor, and Hospital portals, including labs,
 * medications, timeline, documents, and AI Copilot responses.
 */

export const DEMO_PATIENT = {
  id: 'pat-isaac-1001',
  name: 'Isaac Richard Noronha',
  dob: '2008-08-30',
  sex: 'Male',
  bloodGroup: 'A+',
  heightCm: 180,
  weightKg: 85,
  location: 'Himachal Pradesh, India',
  regularDoctor: 'Dr. Raskik, MD',
  regularHospital: 'Namo Hospital & Research Center',
  allergies: ['Penicillin (mild rash)', 'Shellfish'],
  allergiesJson: JSON.stringify(['Penicillin (mild rash)', 'Shellfish']),
  emergencyContact: {
    name: 'Richard Noronha',
    phone: '+91-9876543210',
    relation: 'Father',
  },
  emergencyContactJson: JSON.stringify({
    name: 'Richard Noronha',
    phone: '+91-9876543210',
    relation: 'Father',
  }),
  importantMedicalInformation:
    'Microcytic hypochromic iron deficiency anemia (Hb: 10.8 g/dL, Ferritin: 12 ng/mL). Prescribed oral Ferrous Ascorbate 100mg.',
  abhaId: '91-8472-1092-4821',
};

export const DEMO_LABS = [
  {
    id: 'lab-hb-01',
    testName: 'Hemoglobin (Hb)',
    category: 'Hematology',
    value: 10.8,
    unit: 'g/dL',
    referenceRange: '13.0 - 17.0 g/dL',
    status: 'LOW',
    isAbnormal: true,
    collectedAt: '2026-09-15T09:30:00.000Z',
    documentId: 'doc-cbc-iron-studies-2026',
    facilityName: 'Namo Hospital Central Diagnostics',
    notes: 'Mild-to-moderate microcytic anemia detected.',
    history: [
      { date: '2026-06-10', value: 12.1 },
      { date: '2026-08-01', value: 11.4 },
      { date: '2026-09-15', value: 10.8 },
    ],
  },
  {
    id: 'lab-ferritin-01',
    testName: 'Serum Ferritin',
    category: 'Iron Profile',
    value: 12,
    unit: 'ng/mL',
    referenceRange: '30 - 400 ng/mL',
    status: 'CRITICAL',
    isAbnormal: true,
    collectedAt: '2026-09-15T09:30:00.000Z',
    documentId: 'doc-cbc-iron-studies-2026',
    facilityName: 'Namo Hospital Central Diagnostics',
    notes: 'Severely depleted iron stores. Iron deficiency confirmed.',
    history: [
      { date: '2026-06-10', value: 25 },
      { date: '2026-09-15', value: 12 },
    ],
  },
  {
    id: 'lab-tibc-01',
    testName: 'Total Iron Binding Capacity (TIBC)',
    category: 'Iron Profile',
    value: 420,
    unit: 'ug/dL',
    referenceRange: '240 - 450 ug/dL',
    status: 'NORMAL',
    isAbnormal: false,
    collectedAt: '2026-09-15T09:30:00.000Z',
    documentId: 'doc-cbc-iron-studies-2026',
    facilityName: 'Namo Hospital Central Diagnostics',
    notes: 'Upper limit of normal, consistent with iron-avid state.',
  },
  {
    id: 'lab-platelets-01',
    testName: 'Platelet Count',
    category: 'Hematology',
    value: 285000,
    unit: '/uL',
    referenceRange: '150,000 - 450,000 /uL',
    status: 'NORMAL',
    isAbnormal: false,
    collectedAt: '2026-09-15T09:30:00.000Z',
    documentId: 'doc-cbc-iron-studies-2026',
    facilityName: 'Namo Hospital Central Diagnostics',
    notes: 'Adequate platelet mass.',
  },
  {
    id: 'lab-glucose-01',
    testName: 'Fasting Blood Glucose',
    category: 'Metabolic',
    value: 92,
    unit: 'mg/dL',
    referenceRange: '70 - 100 mg/dL',
    status: 'NORMAL',
    isAbnormal: false,
    collectedAt: '2026-09-15T09:30:00.000Z',
    documentId: 'doc-cbc-iron-studies-2026',
    facilityName: 'Namo Hospital Central Diagnostics',
    notes: 'Euglycemic profile.',
  },
];

export const DEMO_MEDICATIONS = [
  {
    id: 'med-iron-01',
    name: 'Ferrous Ascorbate',
    dosage: '100 mg elemental iron',
    frequency: 'Once daily after dinner',
    route: 'Oral',
    status: 'ACTIVE',
    startDate: '2026-09-16T00:00:00.000Z',
    prescribedBy: 'Dr. Raskik, MD',
    facility: 'Namo Hospital & Research Center',
    instructions: 'Take with vitamin C or water. Avoid milk, antacids, or tea within 2 hours.',
    reason: 'Correction of iron deficiency anemia',
  },
  {
    id: 'med-vitc-01',
    name: 'Vitamin C (Ascorbic Acid)',
    dosage: '500 mg',
    frequency: 'Once daily with iron supplement',
    route: 'Oral',
    status: 'ACTIVE',
    startDate: '2026-09-16T00:00:00.000Z',
    prescribedBy: 'Dr. Raskik, MD',
    facility: 'Namo Hospital & Research Center',
    instructions: 'Enhances intestinal iron absorption.',
    reason: 'Iron absorption co-factor',
  },
];

export const DEMO_DOCUMENTS = [
  {
    id: 'doc-cbc-iron-studies-2026',
    title: 'CBC + Iron Studies [SYNTHETIC TEST DATA]',
    documentType: 'LAB_REPORT',
    facilityName: 'Namo Hospital & Research Center',
    doctorName: 'Dr. Raskik, MD',
    documentDate: '2026-09-15T09:30:00.000Z',
    status: 'VERIFIED',
    ocrConfidence: 0.99,
    summary:
      'NAMO HOSPITAL - LABORATORY SERVICES. Date: 15 September 2026. Hemoglobin: 10.8 g/dL (Reference: 13.0 - 17.0). Ferritin: 12 ng/mL (Reference: 30 - 400). Microcytic hypochromic indices noted.',
    extractedData: {
      hemoglobin: '10.8 g/dL',
      ferritin: '12 ng/mL',
      tibc: '420 ug/dL',
      platelets: '285,000 /uL',
    },
  },
  {
    id: 'doc-consultation-dr-raskik',
    title: 'Internal Medicine Consultation Summary',
    documentType: 'CLINICAL_NOTE',
    facilityName: 'Namo Hospital & Research Center',
    doctorName: 'Dr. Raskik, MD',
    documentDate: '2026-09-16T11:00:00.000Z',
    status: 'VERIFIED',
    ocrConfidence: 0.98,
    summary:
      'Clinical consultation for fatigue and exertion tiredness. Confirmed iron deficiency anemia secondary to diet. Prescribed oral Ferrous Ascorbate 100mg. Follow-up scheduled in 6 weeks.',
    extractedData: {
      assessment: 'Iron deficiency anemia',
      plan: 'Oral Ferrous Ascorbate 100mg daily for 6 weeks, then repeat CBC',
    },
  },
  {
    id: 'doc-annual-checkup-2025',
    title: 'Annual Preventive Health Screening',
    documentType: 'DISCHARGE_SUMMARY',
    facilityName: 'Namo Hospital & Research Center',
    doctorName: 'Dr. Raskik, MD',
    documentDate: '2025-11-20T10:00:00.000Z',
    status: 'VERIFIED',
    ocrConfidence: 0.97,
    summary: 'Routine comprehensive screening. Cardiopulmonary exam normal. Baseline vitals stable.',
  },
];

export const DEMO_TIMELINE = [
  {
    id: 'ev-01',
    title: 'Prescribed Oral Iron Supplementation',
    date: '2026-09-16T11:30:00.000Z',
    type: 'MEDICATION',
    provider: 'Dr. Raskik, MD',
    facility: 'Namo Hospital & Research Center',
    description: 'Started Ferrous Ascorbate 100mg daily with Vitamin C 500mg for iron store replenishment.',
  },
  {
    id: 'ev-02',
    title: 'Internal Medicine Consultation',
    date: '2026-09-16T10:00:00.000Z',
    type: 'ENCOUNTER',
    provider: 'Dr. Raskik, MD',
    facility: 'Namo Hospital & Research Center',
    description: 'Review of abnormal CBC and Ferritin results. Patient informed of iron deficiency diagnosis.',
  },
  {
    id: 'ev-03',
    title: 'Blood Specimen Collected & Analyzed',
    date: '2026-09-15T09:30:00.000Z',
    type: 'LAB',
    provider: 'Central Diagnostics',
    facility: 'Namo Hospital & Research Center',
    description: 'Hemoglobin flagged Low (10.8 g/dL) and Serum Ferritin flagged Critical Low (12 ng/mL).',
  },
  {
    id: 'ev-04',
    title: 'Symptom Onset Recorded',
    date: '2026-09-10T14:00:00.000Z',
    type: 'SYMPTOM',
    provider: 'Patient Reported',
    facility: 'Personal Record',
    description: 'Afternoon lethargy, lightheadedness on rapid standing, and decreased exercise endurance.',
  },
];

export const DEMO_APPOINTMENTS = [
  {
    id: 'appt-demo-01',
    doctorName: 'Dr. Raskik',
    hospitalName: 'Namo Hospital',
    appointmentDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    reason: 'Follow-up consultation for iron deficiency evaluation',
    notes: 'Bring repeat hemoglobin and ferritin test results',
    status: 'SCHEDULED',
  },
];

export const DEMO_CONSENTS = [
  {
    id: 'consent-01',
    grantedToName: 'Dr. Raskik, MD',
    grantedToRole: 'DOCTOR',
    identifier: 'DOC-RASKIK-4091',
    purpose: 'Direct clinical care, evaluation of anemia, and prescription management',
    status: 'ACTIVE',
    createdAt: '2026-09-15T10:00:00.000Z',
    expiresAt: '2027-09-15T10:00:00.000Z',
  },
  {
    id: 'consent-02',
    grantedToName: 'Namo Hospital & Research Center',
    grantedToRole: 'HOSPITAL',
    identifier: 'HOSP-NAMO-001',
    purpose: 'Institutional lab test storage and health record synchronization',
    status: 'ACTIVE',
    createdAt: '2026-09-15T09:00:00.000Z',
    expiresAt: '2027-09-15T09:00:00.000Z',
  },
];

export const DEMO_DOCTOR_DASHBOARD = {
  doctor: {
    name: 'Dr. Raskik, MD',
    specialty: 'Internal Medicine',
    uniqueId: 'DOC-RASKIK-4091',
    license: 'MCI-2024-88492',
    hospital: 'Namo Hospital & Research Center',
  },
  patients: [
    {
      id: 'pat-isaac-1001',
      patientId: 'PAT-ISAAC-1001',
      name: 'Isaac Richard Noronha',
      age: 18,
      gender: 'Male',
      bloodGroup: 'A+',
      condition: 'Microcytic Iron Deficiency Anemia',
      lastVisit: '2026-09-16',
      status: 'ACTIVE_CARE',
      keyMetrics: 'Hb: 10.8 g/dL (Low), Ferritin: 12 ng/mL (Critical)',
      activeMeds: 'Ferrous Ascorbate 100mg, Vitamin C 500mg',
    },
  ],
  stats: {
    activePatients: 24,
    pendingLabOrders: 2,
    activeConsents: 18,
    scheduledToday: 4,
  },
};

export const DEMO_HOSPITAL_DASHBOARD = {
  hospital: {
    name: 'Namo Hospital & Research Center',
    uniqueId: 'HOSP-NAMO-001',
    code: 'NABH-HOSP-2026-901',
    location: 'Himachal Pradesh, India',
    accreditation: 'NABH Accredited & Ayushman Bharat Empanelled',
  },
  departments: [
    'Internal Medicine',
    'Hematology & Oncology',
    'Diagnostic Pathology',
    'Cardiology',
    'Emergency Medicine',
  ],
  doctors: [
    {
      id: 'doc-raskik',
      name: 'Dr. Raskik, MD',
      uniqueId: 'DOC-RASKIK-4091',
      department: 'Internal Medicine',
      patientsCount: 24,
      status: 'ON_DUTY',
    },
  ],
  patients: [
    {
      id: 'pat-isaac-1001',
      patientId: 'PAT-ISAAC-1001',
      name: 'Isaac Richard Noronha',
      age: 18,
      doctor: 'Dr. Raskik, MD',
      status: 'OUTPATIENT',
      lastEncounter: '2026-09-16',
    },
  ],
  stats: {
    totalBeds: 250,
    occupancyRate: '78%',
    activeDoctors: 42,
    verifiedUploads: 1840,
  },
};

export const DEMO_AUDIT_LOGS = [
  {
    id: 'audit-01',
    action: 'RECORD_ACCESSED',
    actor: 'Dr. Raskik, MD (DOC-RASKIK-4091)',
    target: 'CBC + Iron Studies [SYNTHETIC TEST DATA]',
    timestamp: '2026-09-16T10:02:14.000Z',
    legalBasis: 'ACTIVE_CONSENT_01',
  },
  {
    id: 'audit-02',
    action: 'CONSENT_GRANTED',
    actor: 'Isaac Richard Noronha (PAT-ISAAC-1001)',
    target: 'Dr. Raskik, MD',
    timestamp: '2026-09-15T10:00:00.000Z',
    legalBasis: 'PATIENT_DIRECT_AUTHORIZATION',
  },
];

/**
 * Generates an intelligent, grounded AI Copilot response for any clinical query,
 * supporting multiple languages with strict citations and safety disclaimers.
 */
export function generateDemoCopilotAnswer(query: string, language: string = 'English') {
  const q = query.toLowerCase();

  let answerText = '';

  // Language greetings and prefixes
  const langLower = language.toLowerCase();
  const isHindi = langLower === 'hindi' || langLower === 'hi';
  const isGujarati = langLower === 'gujarati' || langLower === 'gu';
  const isTamil = langLower === 'tamil' || langLower === 'ta';

  if (q.includes('hemoglobin') || q.includes('hemo') || q.includes('hb') || q.includes('blood count')) {
    if (isHindi) {
      answerText =
        'आपके **15 सितंबर 2026** के नमो हॉस्पिटल लैब रिकॉर्ड के अनुसार, आपका **हीमोग्लोबिन 10.8 g/dL** (सामान्य सीमा: 13.0 - 17.0 g/dL) है, जो सामान्य से कम है और हल्के एनीमिया का संकेत देता है। इसके अतिरिक्त, आपका सीरम फेरिटिन केवल 12 ng/mL है, जो आयरन की कमी दर्शाता है। डॉ. रास्किक ने फेरस एस्कॉर्बेट 100mg निर्धारित किया है।';
    } else if (isGujarati) {
      answerText =
        'તમારા **15 સપ્ટેમ્બર 2026** ના નમો હોસ્પિટલના લેબ રેકોર્ડ મુજબ, તમારું **હિમોગ્લોબિન 10.8 g/dL** છે (સામાન્ય મર્યાદા: 13.0 - 17.0 g/dL), જે સામાન્ય કરતાં ઓછું છે અને એનિમિયા સૂચવે છે. સાથે સીરમ ફેરીટિન 12 ng/mL છે. ડૉ. રાસ્કિકે ફેરસ એસ્કોર્બેટ 100mg ની ગોળી લેવાની સલાહ આપી છે.';
    } else if (isTamil) {
      answerText =
        'உங்கள் **15 செப்டம்பர் 2026** நமோ மருத்துவமனை பரிசோதனை முடிவின்படி, உங்கள் **ஹீமோகுளோபின் அளவு 10.8 g/dL** ஆகும் (இயல்பு வரம்பு: 13.0 - 17.0 g/dL). இது இரத்த சோகை மற்றும் இரும்புச்சத்து குறைபாட்டைக் குறிக்கிறது.';
    } else {
      answerText =
        'Based on your authorized laboratory records from **2026-09-15** at **Namo Hospital Central Diagnostics**:\n\n• **Hemoglobin**: **10.8 g/dL** (Reference Range: 13.0 - 17.0 g/dL) — *Below Normal (Mild-to-moderate anemia)*\n• **Serum Ferritin**: **12 ng/mL** (Reference: 30 - 400 ng/mL) — *Significantly Depleted Iron Stores*\n\n**Clinical Interpretation**: Your red blood cells show microcytic hypochromic indices caused by low ferritin reserves. Dr. Raskik has prescribed oral Ferrous Ascorbate (100mg elemental iron) with Vitamin C.';
    }
  } else if (q.includes('ferritin') || q.includes('iron')) {
    if (isHindi) {
      answerText =
        'आपका **सीरम फेरिटिन 12 ng/mL** है (सामान्य सीमा: 30 - 400 ng/mL)। यह शरीर में आयरन के कम भंडार को दर्शाता है। फेरिटिन कम होने से हीमोग्लोबिन का उत्पादन धीमा हो जाता है।';
    } else if (isGujarati) {
      answerText =
        'તમારું **સીરમ ફેરીટિન 12 ng/mL** છે (સામાન્ય મર્યાદા: 30 - 400 ng/mL). આ શરીરમાં આયર્નનો સંગ્રહ ઘટી ગયો હોવાનું દર્શાવે છે.';
    } else {
      answerText =
        'Your **Serum Ferritin is 12 ng/mL** (Reference: 30 - 400 ng/mL). Ferritin measures your stored iron capacity. Because your stores are depleted, your bone marrow is producing fewer hemoglobin molecules, contributing to fatigue.';
    }
  } else if (q.includes('stop') || q.includes('change') || q.includes('dose') || q.includes('dosage')) {
    answerText =
      '⚠️ **Clinical Safety Protocol Enforced**: HealthX AI cannot recommend altering your medication dosage or stopping prescribed treatments. Please continue Ferrous Ascorbate 100mg as prescribed by Dr. Raskik, and contact Namo Hospital before making any changes.';
  } else {
    answerText =
      `Based on your current medical profile at Namo Hospital, you are under active care for iron deficiency anemia. Current medications: Ferrous Ascorbate 100mg once daily. Your next clinical follow-up is scheduled with Dr. Raskik.`;
  }

  return {
    conversation_id: 'conv-' + Date.now(),
    message_id: 'msg-' + Date.now(),
    answer: answerText,
    citations: [
      {
        documentId: 'doc-cbc-iron-studies-2026',
        documentTitle: 'CBC + Iron Studies [SYNTHETIC TEST DATA]',
        page: 1,
        date: '2026-09-15',
        field: 'Hematology Panel',
        excerpt:
          'NAMO HOSPITAL - LABORATORY SERVICES. Date: 15 September 2026. Hemoglobin: 10.8 g/dL (Reference: 13.0 - 17.0). Ferritin: 12 ng/mL.',
      },
    ],
    confidence: 0.99,
    used_records: [
      {
        id: 'doc-cbc-iron-studies-2026',
        type: 'LAB_REPORT',
        title: 'CBC + Iron Studies [SYNTHETIC TEST DATA]',
      },
    ],
    safety_flags: {
      refusedDiagnosis: q.includes('diagnos') || q.includes('disease'),
      refusedMedicationChange: q.includes('stop') || q.includes('change'),
      refusedDosageInvention: q.includes('dose') || q.includes('dosage'),
      insufficientEvidence: false,
    },
    language,
  };
}
