# HealthX AI — Verification & Testing Harness (Sections 76, 77, 78, 79, 102)

## Test Coverage
- **Security Tests (`tests/security/security.test.ts`)**:
  - Verification that User A cannot access User B's documents (IDOR prevention)
  - Verification that Doctor cannot access unauthorized patient without consent
  - Verification that revoked consent immediately terminates access
  - Verification that expired consent blocks access
  - Verification that Admin cannot silently inspect clinical records without explicit consent
  - Rate-limiting & brute force protection
- **RAG & Clinical Safety Tests (`tests/rag/rag.test.ts`)**:
  - Verification that AI cites exact document and page
  - Verification that AI refuses independent diagnoses
  - Verification that AI refuses medication stoppage
  - Verification that AI never invents dosages
  - Verification that AI states uncertainty when evidence is insufficient
- **FHIR Tests (`tests/unit/fhir.test.ts`)**:
  - Validation of FHIR Patient, Observation, MedicationRequest models
  - Serializer and parser integrity
- **ML Evaluation Tests (`apps/ml-service/test_ml.py`)**:
  - Model accuracy, NER precision/recall, OCR handwriting detection, PII de-identification

## Running Automated Tests
```bash
# Run all TypeScript & Security tests
npm test

# Run ML Pytest suite
npm run test:ml
```
