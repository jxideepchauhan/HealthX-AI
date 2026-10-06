# HealthX AI — FHIR Release 4 Interoperability (Sections 48, 49)

## FHIR R4 Compatibility Layer (`@healthx/fhir`)
HealthX AI provides bi-directional mapping and validation for standard HL7 FHIR Release 4 resources:
- `Patient`: Demographics, telecom, emergency contacts.
- `Observation`: Laboratory biomarker measurements with LOINC codes, reference intervals, and interpretation flags.
- `MedicationRequest`: Prescriptions with intent, status, and dosage instructions.
- `Encounter`: Consultations with practitioner references.
- `DiagnosticReport`: Clinical laboratory and imaging reports.
- `Consent`: Explicit consent provisions with validity period and scope.
- `AuditEvent`: FHIR compliant audit events.

## Endpoints
- `GET /api/v1/fhir/Patient/:id`
- `GET /api/v1/fhir/Observation`
- `GET /api/v1/fhir/DiagnosticReport`
- `GET /api/v1/fhir/MedicationRequest`
- `GET /api/v1/fhir/export`: Full FHIR R4 Bundle export.
- `POST /api/v1/fhir/import`: Ingests FHIR resources and normalizes into HealthX store.
