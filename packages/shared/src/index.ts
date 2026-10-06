import { z } from 'zod';
import type { LabStatus } from '@healthx/types';

// ==========================================
// ERROR CODES & APP ERROR
// ==========================================
export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'DOCUMENT_NOT_FOUND'
  | 'CONSENT_REQUIRED'
  | 'CONSENT_EXPIRED'
  | 'CONSENT_REVOKED'
  | 'DUPLICATE_DOCUMENT'
  | 'UNSUPPORTED_FILE_TYPE'
  | 'FILE_TOO_LARGE'
  | 'OCR_PROCESSING_FAILED'
  | 'EXTRACTION_FAILED'
  | 'ML_SERVICE_UNAVAILABLE'
  | 'ABDM_SERVICE_ERROR'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INVALID_CREDENTIALS'
  | 'INVALID_OTP'
  | 'OTP_EXPIRED'
  | 'INTERNAL_SERVER_ERROR';

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(code: ErrorCode, message: string, statusCode = 400, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function formatErrorResponse(err: unknown, requestId = 'req-unknown') {
  if (err instanceof AppError) {
    return {
      error: {
        code: err.code,
        message: err.message,
        requestId,
        details: err.details,
      },
    };
  }

  if (err instanceof z.ZodError) {
    return {
      error: {
        code: 'VALIDATION_ERROR' as ErrorCode,
        message: 'Invalid request payload: ' + err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
        requestId,
        details: err.errors,
      },
    };
  }

  const message = err instanceof Error ? err.message : 'An unexpected internal error occurred.';
  return {
    error: {
      code: 'INTERNAL_SERVER_ERROR' as ErrorCode,
      message,
      requestId,
    },
  };
}

// ==========================================
// CONSTANTS
// ==========================================
export const SUPPORTED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/tiff',
];

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

export const AI_DISCLAIMER =
  'HealthX AI is an intelligent health-record assistant and NOT an autonomous medical decision maker. It does not provide diagnoses, prescribe medication, or alter doctor instructions. Always consult a licensed healthcare professional for clinical decisions.';

export const INSUFFICIENT_EVIDENCE_RESPONSE =
  "I couldn't find enough information in your HealthX records to answer that reliably.";

// ==========================================
// ZOD VALIDATION SCHEMAS
// ==========================================
export const RequestOtpSchema = z.object({
  identifier: z.string().min(3).max(100), // phone or email
  role: z.enum(['PATIENT', 'DOCTOR', 'HOSPITAL', 'ADMIN', 'ML_ENGINEER']).default('PATIENT'),
});

export const VerifyOtpSchema = z.object({
  identifier: z.string().min(3).max(100),
  otp: z.string().length(6),
  deviceInfo: z.string().optional(),
});

export const LoginPasswordSchema = z.object({
  identifier: z.string().min(1, 'Identifier or Unique ID is required'),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['PATIENT', 'DOCTOR', 'HOSPITAL', 'ADMIN', 'ML_ENGINEER']).optional(),
  deviceInfo: z.string().optional(),
});

export const DoctorPrescriptionSchema = z.object({
  patientId: z.string(),
  name: z.string().min(1),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
  instructions: z.string().min(1),
  reason: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const DoctorClinicalNoteSchema = z.object({
  patientId: z.string(),
  encounterType: z.enum(['CONSULTATION', 'EMERGENCY', 'FOLLOW_UP', 'TELEHEALTH']).default('CONSULTATION'),
  reason: z.string().min(1),
  assessment: z.string().min(1),
  plan: z.string().optional(),
  vitals: z.record(z.any()).optional(),
  date: z.string().optional(),
});

export const DoctorLabOrderSchema = z.object({
  patientId: z.string(),
  testNames: z.array(z.string()).min(1),
  priority: z.enum(['ROUTINE', 'URGENT', 'STAT']).default('ROUTINE'),
  clinicalNotes: z.string().optional(),
});

export const ProfileUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  dob: z.string().optional(),
  sex: z.enum(['Male', 'Female', 'Other']).optional(),
  preferredLanguage: z.string().optional(),
  location: z.string().optional(),
  bloodGroup: z.string().optional(),
  heightCm: z.number().positive().optional(),
  weightKg: z.number().positive().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  importantMedicalInformation: z.string().optional(),
  regularDoctor: z.string().optional(),
  regularHospital: z.string().optional(),
  sleepHours: z.string().optional(),
  exerciseHabits: z.string().optional(),
  dailySteps: z.number().nonnegative().optional(),
});

export const VerifyDocumentEntitySchema = z.object({
  entityId: z.string().uuid(),
  correctedValue: z.string().optional(),
  verificationStatus: z.enum(['USER_VERIFIED', 'SOURCE_VERIFIED']),
});

export const CreateConsentSchema = z.object({
  recipientId: z.string().min(1),
  recipientName: z.string().min(1),
  recipientRole: z.enum(['DOCTOR', 'HOSPITAL', 'ADMIN']),
  organizationId: z.string().optional(),
  organizationName: z.string().optional(),
  scope: z.enum(['LABS', 'PRESCRIPTIONS', 'CONSULTATIONS', 'MEDICATIONS', 'DOCUMENTS', 'ALL']),
  records: z.array(z.string()).optional(),
  startDate: z.string().datetime().optional(),
  expiryDate: z.string().datetime(),
  purpose: z.string().min(3).max(500),
});

export const CreateAppointmentSchema = z.object({
  doctorName: z.string().min(1),
  hospitalName: z.string().optional(),
  appointmentDate: z.string().datetime(),
  reason: z.string().min(1),
  notes: z.string().optional(),
});

export const CreateMedicationSchema = z.object({
  name: z.string().min(1),
  genericName: z.string().optional(),
  strength: z.string().optional(),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
  route: z.string().optional(),
  duration: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  prescriber: z.string().optional(),
  instructions: z.string().optional(),
});

export const AssistantChatSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().min(1).max(2000),
  language: z.enum(['English', 'Hindi', 'Tamil', 'Telugu', 'Marathi', 'Bengali']).default('English'),
  detailLevel: z.enum(['SIMPLE', 'DETAILED']).default('SIMPLE'),
});

// ==========================================
// NORMALIZATION HELPERS
// ==========================================

const LAB_NAME_ALIASES: Record<string, string> = {
  hb: 'Hemoglobin',
  hgb: 'Hemoglobin',
  hemoglobin: 'Hemoglobin',
  rbc: 'Red Blood Cell Count',
  'red blood cell count': 'Red Blood Cell Count',
  wbc: 'White Blood Cell Count',
  'white blood cell count': 'White Blood Cell Count',
  tlc: 'White Blood Cell Count',
  platelets: 'Platelet Count',
  'platelet count': 'Platelet Count',
  ferritin: 'Serum Ferritin',
  'serum ferritin': 'Serum Ferritin',
  mcv: 'Mean Corpuscular Volume',
  'mean corpuscular volume': 'Mean Corpuscular Volume',
  mch: 'Mean Corpuscular Hemoglobin',
  mchc: 'Mean Corpuscular Hemoglobin Concentration',
  tsh: 'Thyroid Stimulating Hormone',
  glucose: 'Fasting Blood Glucose',
  'blood sugar': 'Fasting Blood Glucose',
  hba1c: 'Glycated Hemoglobin (HbA1c)',
};

export function normalizeLabTestName(raw: string): string {
  const clean = raw.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '');
  return LAB_NAME_ALIASES[clean] || raw.trim();
}

export function normalizeUnit(raw: string): string {
  const clean = raw.trim().toLowerCase();
  if (clean === 'g/dl' || clean === 'gm/dl' || clean === 'g/100ml') return 'g/dL';
  if (clean === 'mg/dl' || clean === 'mgm/dl') return 'mg/dL';
  if (clean === 'ng/ml') return 'ng/mL';
  if (clean === 'fl') return 'fL';
  if (clean === 'pg') return 'pg';
  if (clean === '/ul' || clean === '/cumm' || clean === 'cells/cumm' || clean === '/µl') return '/µL';
  if (clean === 'million/ul' || clean === 'mil/cumm' || clean === 'million/µl') return 'million/µL';
  if (clean === '%' || clean === 'percent') return '%';
  return raw.trim();
}

export function determineLabStatus(
  val: number,
  low?: number,
  high?: number
): LabStatus {
  if (low !== undefined && high !== undefined) {
    if (val < low) return 'LOW';
    if (val > high) return 'HIGH';
    return 'NORMAL';
  }
  if (low !== undefined && val < low) return 'LOW';
  if (high !== undefined && val > high) return 'HIGH';
  return 'UNKNOWN';
}
