/**
 * HealthX AI FHIR Interoperability Layer
 * Supports FHIR Release 4 (R4) resource representations, validation, serialization, and import mapping.
 */

import { AppError } from '@healthx/shared';
import type { LabResultItem, MedicationItem, UserProfileData } from '@healthx/types';

export interface FHIRIdentifier {
  system?: string;
  value: string;
}

export interface FHIRCoding {
  system?: string;
  code?: string;
  display?: string;
}

export interface FHIRCodeableConcept {
  coding?: FHIRCoding[];
  text?: string;
}

export interface FHIRReference {
  reference: string;
  display?: string;
}

export interface FHIRPeriod {
  start?: string;
  end?: string;
}

export interface FHIRQuantity {
  value: number;
  unit: string;
  system?: string;
  code?: string;
}

export interface FHIRRange {
  low?: FHIRQuantity;
  high?: FHIRQuantity;
}

// ------------------------------------------
// FHIR RESOURCES
// ------------------------------------------

export interface FHIRPatient {
  resourceType: 'Patient';
  id: string;
  identifier?: FHIRIdentifier[];
  active?: boolean;
  name: Array<{
    use?: string;
    text: string;
    family?: string;
    given?: string[];
  }>;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: string;
  address?: Array<{
    text?: string;
    city?: string;
    state?: string;
    country?: string;
  }>;
  contact?: Array<{
    relationship?: FHIRCodeableConcept[];
    name?: { text: string };
    telecom?: Array<{ system: string; value: string }>;
  }>;
}

export interface FHIRObservation {
  resourceType: 'Observation';
  id: string;
  status: 'registered' | 'preliminary' | 'final' | 'amended' | 'corrected';
  category?: FHIRCodeableConcept[];
  code: FHIRCodeableConcept;
  subject: FHIRReference;
  effectiveDateTime?: string;
  valueQuantity?: FHIRQuantity;
  valueString?: string;
  referenceRange?: Array<{
    low?: FHIRQuantity;
    high?: FHIRQuantity;
    text?: string;
  }>;
  interpretation?: FHIRCodeableConcept[];
}

export interface FHIRCondition {
  resourceType: 'Condition';
  id: string;
  clinicalStatus?: FHIRCodeableConcept;
  verificationStatus?: FHIRCodeableConcept;
  category?: FHIRCodeableConcept[];
  code: FHIRCodeableConcept;
  subject: FHIRReference;
  recordedDate?: string;
  note?: Array<{ text: string }>;
}

export interface FHIRMedicationRequest {
  resourceType: 'MedicationRequest';
  id: string;
  status: 'active' | 'on-hold' | 'cancelled' | 'completed' | 'entered-in-error' | 'stopped';
  intent: 'order' | 'plan' | 'proposal';
  medicationCodeableConcept: FHIRCodeableConcept;
  subject: FHIRReference;
  authoredOn?: string;
  requester?: FHIRReference;
  dosageInstruction?: Array<{
    text?: string;
    timing?: { repeat?: { frequency?: number; period?: number; periodUnit?: string } };
    route?: FHIRCodeableConcept;
  }>;
}

export interface FHIREncounter {
  resourceType: 'Encounter';
  id: string;
  status: 'planned' | 'arrived' | 'triaged' | 'in-progress' | 'onleave' | 'finished' | 'cancelled';
  class: FHIRCoding;
  subject: FHIRReference;
  period?: FHIRPeriod;
  reasonCode?: FHIRCodeableConcept[];
  serviceProvider?: FHIRReference;
}

export interface FHIRDiagnosticReport {
  resourceType: 'DiagnosticReport';
  id: string;
  status: 'registered' | 'partial' | 'preliminary' | 'final';
  category?: FHIRCodeableConcept[];
  code: FHIRCodeableConcept;
  subject: FHIRReference;
  effectiveDateTime?: string;
  issued?: string;
  result?: FHIRReference[];
  conclusion?: string;
}

export interface FHIRDocumentReference {
  resourceType: 'DocumentReference';
  id: string;
  status: 'current' | 'superseded' | 'entered-in-error';
  type: FHIRCodeableConcept;
  subject: FHIRReference;
  date?: string;
  description?: string;
  content: Array<{
    attachment: {
      contentType: string;
      url?: string;
      title?: string;
    };
  }>;
}

export interface FHIRPractitioner {
  resourceType: 'Practitioner';
  id: string;
  identifier?: FHIRIdentifier[];
  name?: Array<{ text: string }>;
}

export interface FHIROrganization {
  resourceType: 'Organization';
  id: string;
  identifier?: FHIRIdentifier[];
  name: string;
}

export interface FHIRConsent {
  resourceType: 'Consent';
  id: string;
  status: 'draft' | 'active' | 'inactive' | 'entered-in-error';
  scope: FHIRCodeableConcept;
  category: FHIRCodeableConcept[];
  patient: FHIRReference;
  dateTime?: string;
  provision?: {
    type?: 'opt-in' | 'opt-out';
    period?: FHIRPeriod;
  };
}

export interface FHIRAuditEvent {
  resourceType: 'AuditEvent';
  id: string;
  type: FHIRCoding;
  action: 'C' | 'R' | 'U' | 'D' | 'E';
  recorded: string;
  outcome?: '0' | '4' | '8' | '12';
  agent: Array<{
    who?: FHIRReference;
    requestor: boolean;
  }>;
  source: {
    observer: FHIRReference;
  };
}

export interface FHIRBundle {
  resourceType: 'Bundle';
  type: 'searchset' | 'transaction' | 'collection';
  total?: number;
  entry: Array<{
    fullUrl?: string;
    resource: AnyFHIRResource;
  }>;
}

export type AnyFHIRResource =
  | FHIRPatient
  | FHIRObservation
  | FHIRCondition
  | FHIRMedicationRequest
  | FHIREncounter
  | FHIRDiagnosticReport
  | FHIRDocumentReference
  | FHIRPractitioner
  | FHIROrganization
  | FHIRConsent
  | FHIRAuditEvent;

// ------------------------------------------
// VALIDATOR
// ------------------------------------------
export function validateFHIRResource(resource: unknown): AnyFHIRResource {
  if (!resource || typeof resource !== 'object') {
    throw new AppError('VALIDATION_ERROR', 'Resource must be an object');
  }

  const res = resource as Record<string, unknown>;
  const allowed = [
    'Patient',
    'Observation',
    'Condition',
    'MedicationRequest',
    'Encounter',
    'DiagnosticReport',
    'DocumentReference',
    'Practitioner',
    'Organization',
    'Consent',
    'AuditEvent',
  ];

  if (!res.resourceType || !allowed.includes(res.resourceType as string)) {
    throw new AppError(
      'VALIDATION_ERROR',
      `Unsupported or missing resourceType: ${String(res.resourceType)}. Expected one of: ${allowed.join(', ')}`
    );
  }

  if (!res.id || typeof res.id !== 'string') {
    throw new AppError('VALIDATION_ERROR', `Resource ${String(res.resourceType)} must have a valid string id`);
  }

  if (res.resourceType === 'Observation' && !res.code) {
    throw new AppError('VALIDATION_ERROR', 'Observation must specify a code concept');
  }

  if (res.resourceType === 'Patient' && (!res.name || !Array.isArray(res.name) || res.name.length === 0)) {
    throw new AppError('VALIDATION_ERROR', 'Patient must specify at least one name element');
  }

  return res as unknown as AnyFHIRResource;
}

// ------------------------------------------
// SERIALIZERS (HealthX -> FHIR)
// ------------------------------------------

export function toFHIRPatient(profile: UserProfileData): FHIRPatient {
  const genderMap: Record<string, 'male' | 'female' | 'other' | 'unknown'> = {
    Male: 'male',
    Female: 'female',
    Other: 'other',
  };

  return {
    resourceType: 'Patient',
    id: profile.id,
    identifier: [
      {
        system: 'https://healthx.ai/patients',
        value: profile.id,
      },
    ],
    active: true,
    name: [
      {
        use: 'official',
        text: profile.name,
      },
    ],
    gender: genderMap[profile.sex] || 'unknown',
    birthDate: profile.dob,
    address: [
      {
        text: profile.location,
        state: profile.location,
        country: 'India',
      },
    ],
    contact: profile.emergencyContactName
      ? [
          {
            relationship: [
              {
                text: profile.emergencyContactRelation || 'Emergency Contact',
              },
            ],
            name: { text: profile.emergencyContactName },
            telecom: profile.emergencyContactPhone
              ? [{ system: 'phone', value: profile.emergencyContactPhone }]
              : [],
          },
        ]
      : [],
  };
}

export function toFHIRObservation(lab: LabResultItem, patientId: string): FHIRObservation {
  const isNumeric = typeof lab.value === 'number' || !isNaN(Number(lab.value));
  const numericVal = isNumeric ? Number(lab.value) : undefined;

  const obs: FHIRObservation = {
    resourceType: 'Observation',
    id: lab.id || `obs-${Date.now()}`,
    status: 'final',
    category: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'laboratory',
            display: 'Laboratory',
          },
        ],
      },
    ],
    code: {
      text: lab.normalizedName || lab.testName,
      coding: [
        {
          system: 'http://loinc.org',
          display: lab.testName,
        },
      ],
    },
    subject: {
      reference: `Patient/${patientId}`,
    },
    effectiveDateTime: lab.date,
  };

  if (numericVal !== undefined) {
    obs.valueQuantity = {
      value: numericVal,
      unit: lab.unit,
    };
  } else {
    obs.valueString = String(lab.value);
  }

  if (lab.referenceLow !== undefined || lab.referenceHigh !== undefined || lab.referenceText) {
    obs.referenceRange = [
      {
        low: lab.referenceLow !== undefined ? { value: lab.referenceLow, unit: lab.unit } : undefined,
        high: lab.referenceHigh !== undefined ? { value: lab.referenceHigh, unit: lab.unit } : undefined,
        text: lab.referenceText,
      },
    ];
  }

  if (lab.status !== 'UNKNOWN') {
    const codeMap: Record<string, string> = { LOW: 'L', HIGH: 'H', NORMAL: 'N' };
    obs.interpretation = [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
            code: codeMap[lab.status] || 'N',
            display: lab.status,
          },
        ],
      },
    ];
  }

  return obs;
}

export function toFHIRMedicationRequest(med: MedicationItem, patientId: string): FHIRMedicationRequest {
  return {
    resourceType: 'MedicationRequest',
    id: med.id || `med-${Date.now()}`,
    status: med.isActive ? 'active' : 'completed',
    intent: 'order',
    medicationCodeableConcept: {
      text: med.name,
      coding: [
        {
          display: med.name,
        },
      ],
    },
    subject: {
      reference: `Patient/${patientId}`,
    },
    authoredOn: med.startDate,
    dosageInstruction: [
      {
        text: [med.dosage, med.frequency, med.duration].filter(Boolean).join(' - ') || 'As directed',
        route: med.route ? { text: med.route } : undefined,
      },
    ],
  };
}

// ------------------------------------------
// PARSER (FHIR -> HealthX Entities)
// ------------------------------------------

export function parseFHIRResource(resource: AnyFHIRResource): {
  type: string;
  mappedData: Record<string, unknown>;
} {
  switch (resource.resourceType) {
    case 'Patient': {
      const p = resource as FHIRPatient;
      const name = p.name?.[0]?.text || 'Unknown Patient';
      return {
        type: 'Patient',
        mappedData: {
          id: p.id,
          name,
          dob: p.birthDate || '',
          gender: p.gender === 'male' ? 'Male' : p.gender === 'female' ? 'Female' : 'Other',
          address: p.address?.[0]?.text || '',
        },
      };
    }

    case 'Observation': {
      const o = resource as FHIRObservation;
      const testName = o.code?.text || o.code?.coding?.[0]?.display || 'Unknown Observation';
      const value = o.valueQuantity?.value ?? o.valueString ?? '';
      const unit = o.valueQuantity?.unit || '';
      const low = o.referenceRange?.[0]?.low?.value;
      const high = o.referenceRange?.[0]?.high?.value;
      const refText = o.referenceRange?.[0]?.text;

      return {
        type: 'Observation',
        mappedData: {
          id: o.id,
          testName,
          value,
          unit,
          referenceLow: low,
          referenceHigh: high,
          referenceText: refText,
          date: o.effectiveDateTime || new Date().toISOString(),
          status: o.interpretation?.[0]?.coding?.[0]?.display || 'UNKNOWN',
        },
      };
    }

    case 'MedicationRequest': {
      const m = resource as FHIRMedicationRequest;
      const name = m.medicationCodeableConcept?.text || m.medicationCodeableConcept?.coding?.[0]?.display || 'Unknown Medication';
      const dosage = m.dosageInstruction?.[0]?.text || '';
      return {
        type: 'MedicationRequest',
        mappedData: {
          id: m.id,
          name,
          dosage,
          isActive: m.status === 'active',
          startDate: m.authoredOn,
        },
      };
    }

    default:
      return {
        type: resource.resourceType,
        mappedData: { id: resource.id, raw: resource },
      };
  }
}
