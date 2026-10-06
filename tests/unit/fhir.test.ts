import { describe, it, expect } from 'vitest';
import {
  validateFHIRResource,
  parseFHIRResource,
  toFHIRPatient,
  toFHIRObservation,
  toFHIRMedicationRequest,
  FHIRPatient,
  FHIRObservation,
} from '@healthx/fhir';

describe('HealthX AI FHIR R4 Interoperability Tests (Sections 48 & 49)', () => {
  it('serializes UserProfileData to standard FHIR R4 Patient', () => {
    const fhirPatient = toFHIRPatient({
      id: 'patient-isaac-noronha-2026',
      name: 'Isaac Richard Noronha',
      dob: '2008-08-30',
      sex: 'Male',
      preferredLanguage: 'English',
      location: 'Himachal Pradesh',
      bloodGroup: 'A+',
      heightCm: 180,
      weightKg: 85,
      emergencyContactName: 'Father',
      emergencyContactRelation: 'Father',
      emergencyContactPhone: '+91-9876543210',
      allergies: ['Unknown'],
      importantMedicalInformation: 'None reported',
    });

    expect(fhirPatient.resourceType).toBe('Patient');
    expect(fhirPatient.name[0].text).toBe('Isaac Richard Noronha');
    expect(fhirPatient.gender).toBe('male');
    expect(fhirPatient.birthDate).toBe('2008-08-30');
    expect(fhirPatient.contact?.[0].name?.text).toBe('Father');
  });

  it('serializes LabResultItem to FHIR R4 Observation with LOINC category and reference range', () => {
    const fhirObs = toFHIRObservation(
      {
        id: 'obs-hb-01',
        testName: 'Hemoglobin',
        value: '10.8',
        numericValue: 10.8,
        unit: 'g/dL',
        referenceLow: 13.0,
        referenceHigh: 17.0,
        referenceText: '13.0 - 17.0 g/dL',
        status: 'LOW',
        date: '2026-09-15',
        dataOrigin: 'SYNTHETIC_TEST',
        verificationStatus: 'SOURCE_VERIFIED',
      },
      'patient-isaac-noronha-2026'
    );

    expect(fhirObs.resourceType).toBe('Observation');
    expect(fhirObs.status).toBe('final');
    expect(fhirObs.valueQuantity?.value).toBe(10.8);
    expect(fhirObs.valueQuantity?.unit).toBe('g/dL');
    expect(fhirObs.referenceRange?.[0].low?.value).toBe(13.0);
    expect(fhirObs.interpretation?.[0].coding?.[0].code).toBe('L');
  });

  it('validates a compliant FHIR resource without throwing', () => {
    const validPatient: FHIRPatient = {
      resourceType: 'Patient',
      id: 'p-1',
      name: [{ text: 'Test Patient' }],
    };

    const res = validateFHIRResource(validPatient);
    expect(res.resourceType).toBe('Patient');
  });

  it('rejects an invalid FHIR resource with unsupported resourceType', () => {
    expect(() => {
      validateFHIRResource({ resourceType: 'NonExistentResource', id: '123' });
    }).toThrow('Unsupported or missing resourceType');
  });

  it('parses external incoming FHIR Observation into internal domain model', () => {
    const externalObs: FHIRObservation = {
      resourceType: 'Observation',
      id: 'ext-obs-99',
      status: 'final',
      code: { text: 'Serum Ferritin' },
      subject: { reference: 'Patient/123' },
      valueQuantity: { value: 12, unit: 'ng/mL' },
      referenceRange: [{ low: { value: 30, unit: 'ng/mL' }, high: { value: 400, unit: 'ng/mL' } }],
    };

    const parsed = parseFHIRResource(externalObs);
    expect(parsed.type).toBe('Observation');
    expect((parsed.mappedData as any).testName).toBe('Serum Ferritin');
    expect((parsed.mappedData as any).value).toBe(12);
  });
});
