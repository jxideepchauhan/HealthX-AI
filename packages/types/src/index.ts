/**
 * HealthX AI Core Type Definitions
 * Complete domain and system interfaces
 */

export type UserRole =
  | 'PATIENT'
  | 'DOCTOR'
  | 'HOSPITAL'
  | 'ADMIN'
  | 'ML_ENGINEER'
  | 'SYSTEM';

export type DataOrigin =
  | 'USER_PROVIDED'
  | 'HOSPITAL_PROVIDED'
  | 'ABDM_IMPORTED'
  | 'SYNTHETIC_TEST'
  | 'AI_DERIVED';

export type DocumentType =
  | 'PRESCRIPTION'
  | 'LAB_REPORT'
  | 'CONSULTATION'
  | 'DISCHARGE_SUMMARY'
  | 'DIAGNOSTIC_REPORT'
  | 'MEDICAL_CERTIFICATE'
  | 'VACCINATION_RECORD'
  | 'OTHER';

export type ProcessingStatus =
  | 'QUEUED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'RETRYING';

export type VerificationStatus =
  | 'UNVERIFIED'
  | 'USER_VERIFIED'
  | 'SOURCE_VERIFIED';

export type LabStatus = 'LOW' | 'NORMAL' | 'HIGH' | 'UNKNOWN';

export type ConsentScope =
  | 'LABS'
  | 'PRESCRIPTIONS'
  | 'CONSULTATIONS'
  | 'MEDICATIONS'
  | 'DOCUMENTS'
  | 'ALL';

export type ConsentStatus = 'ACTIVE' | 'EXPIRED' | 'REVOKED';

export type AuditAction =
  | 'VIEW'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'EXPORT'
  | 'SHARE'
  | 'REVOKE'
  | 'IMPORT';

export type AuditResult = 'SUCCESS' | 'DENIED' | 'FAILED';

export type TimelineEventType =
  | 'CONSULTATION'
  | 'LAB'
  | 'PRESCRIPTION'
  | 'DIAGNOSIS'
  | 'PROCEDURE'
  | 'FOLLOW_UP'
  | 'DOCUMENT_UPLOAD'
  | 'HOSPITAL_EVENT';

export type ABDMStatus = 'NOT_CONNECTED' | 'PENDING' | 'CONNECTED' | 'ERROR';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OCRPageResult {
  pageNumber: number;
  text: string;
  confidence: number;
  isHandwritten: boolean;
  handwritingConfidence: number;
  blocks?: Array<{
    text: string;
    confidence: number;
    boundingBox?: BoundingBox;
  }>;
}

export interface OCRResult {
  text: string;
  pages: OCRPageResult[];
  confidence: number;
  language: string;
  isHandwritten: boolean;
  handwritingConfidence: number;
}

export interface ExtractedEntity {
  id?: string;
  documentId?: string;
  entityType:
    | 'PATIENT'
    | 'DOCTOR'
    | 'HOSPITAL'
    | 'DATE'
    | 'DIAGNOSIS'
    | 'ASSESSMENT'
    | 'SYMPTOM'
    | 'MEDICATION'
    | 'DOSAGE'
    | 'FREQUENCY'
    | 'DURATION'
    | 'LAB_TEST'
    | 'VALUE'
    | 'UNIT'
    | 'REFERENCE_RANGE'
    | 'ABNORMAL_STATUS'
    | 'PROCEDURE'
    | 'FOLLOW_UP'
    | 'INSTRUCTIONS';
  value: string;
  normalizedValue?: string;
  confidence: number;
  page?: number;
  boundingBox?: BoundingBox;
  verificationStatus?: VerificationStatus;
}

export interface LabResultItem {
  id?: string;
  testName: string;
  normalizedName?: string;
  value: number | string;
  numericValue?: number;
  unit: string;
  referenceLow?: number;
  referenceHigh?: number;
  referenceText?: string;
  status: LabStatus;
  date: string;
  sourceDocumentId?: string;
  sourceDocumentTitle?: string;
  page?: number;
  dataOrigin: DataOrigin;
  verificationStatus: VerificationStatus;
  notes?: string;
}

export interface MedicationItem {
  id?: string;
  name: string;
  genericName?: string;
  strength?: string;
  dosage?: string;
  frequency?: string;
  route?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  prescriber?: string;
  hospital?: string;
  sourceDocumentId?: string;
  dataOrigin: DataOrigin;
  verificationStatus: VerificationStatus;
  isActive: boolean;
  instructions?: string;
}

export interface VitalSignItem {
  type: 'BP' | 'SPO2' | 'HEART_RATE' | 'TEMPERATURE' | 'WEIGHT' | 'SLEEP' | 'STEPS';
  value: string | number;
  unit: string;
  date: string;
  dataOrigin: DataOrigin;
  notes?: string;
}

export interface UserProfileData {
  id: string;
  name: string;
  dob: string;
  sex: 'Male' | 'Female' | 'Other';
  preferredLanguage: string;
  location: string;
  bloodGroup: string;
  heightCm: number;
  weightKg: number;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  allergies: string[];
  importantMedicalInformation: string;
  regularDoctor?: string;
  regularHospital?: string;
  vitalSigns?: VitalSignItem[];
  sleepHours?: string;
  exerciseHabits?: string;
  dailySteps?: number;
}

export interface Citation {
  documentId: string;
  documentTitle: string;
  page: number;
  field?: string;
  date?: string;
  excerpt: string;
  boundingBox?: BoundingBox;
}

export interface AssistantChatResponse {
  conversationId: string;
  messageId: string;
  answer: string;
  citations: Citation[];
  confidence: number;
  usedRecords: Array<{ id: string; type: string; title: string }>;
  safetyFlags: {
    refusedDiagnosis: boolean;
    refusedMedicationChange: boolean;
    refusedDosageInvention: boolean;
    insufficientEvidence: boolean;
  };
  language: string;
}

export interface DoctorVisitBrief {
  patientSummary: {
    name: string;
    age: number;
    sex: string;
    bloodGroup: string;
    knownAllergies: string[];
    vitalSummary: Record<string, string | number>;
  };
  recentEncounters: Array<{ date: string; doctor?: string; hospital?: string; reason?: string }>;
  recentReports: Array<{ id: string; title: string; date: string; type: string }>;
  labChanges: Array<{
    testName: string;
    latestValue: string;
    latestDate: string;
    status: LabStatus;
    referenceRange: string;
    trend?: 'INCREASING' | 'DECREASING' | 'STABLE';
  }>;
  recordedMedicines: Array<{
    name: string;
    dosage?: string;
    frequency?: string;
    startDate?: string;
    prescriber?: string;
  }>;
  documentedSymptoms: Array<{ symptom: string; reportedDate: string; notes?: string }>;
  questionsForDoctor: string[];
  generatedAt: string;
}

export interface ConsentRecord {
  id: string;
  patientId: string;
  recipientId: string;
  recipientName: string;
  recipientRole: UserRole;
  organizationId?: string;
  organizationName?: string;
  scope: ConsentScope;
  records?: string[];
  startDate: string;
  expiryDate: string;
  status: ConsentStatus;
  purpose: string;
  createdAt: string;
}

export interface AuditRecord {
  id: string;
  userId: string;
  userRole: UserRole;
  action: AuditAction;
  resource: string;
  resourceId: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  result: AuditResult;
  metadata?: Record<string, unknown>;
}

export interface TimelineEventItem {
  id: string;
  userId: string;
  eventType: TimelineEventType;
  title: string;
  description: string;
  date: string;
  sourceDocumentId?: string;
  dataOrigin: DataOrigin;
  metadata?: Record<string, unknown>;
}

export interface MLModelRecord {
  modelName: string;
  version: string;
  datasetVersion: string;
  metrics: {
    accuracy?: number;
    precision?: number;
    recall?: number;
    f1?: number;
    cer?: number;
    wer?: number;
    fieldAccuracy?: number;
    latencyMs?: number;
  };
  artifactPath: string;
  createdAt: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'TRAINING';
}

export interface ProcessingJobRecord {
  id: string;
  documentId: string;
  status: ProcessingStatus;
  attempts: number;
  maxAttempts: number;
  stage: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}
