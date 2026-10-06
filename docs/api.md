# HealthX AI — REST API Documentation

All endpoints are hosted under `/api/v1` with complete OpenAPI documentation available at `/docs`.

## Error Response Format (Section 54)
Consistent error envelope:
```json
{
  "error": {
    "code": "DOCUMENT_NOT_FOUND",
    "message": "The requested document could not be found.",
    "requestId": "req-12345"
  }
}
```

## Primary Endpoints
- **Authentication**:
  - `POST /auth/request-otp`: Request 6-digit cryptographic OTP.
  - `POST /auth/verify-otp`: Verify OTP and receive JWT access/refresh tokens.
  - `POST /auth/logout`: Clear session cookies.
  - `GET /auth/session`: Retrieve current verified session and profile.
- **Documents**:
  - `POST /documents`: Upload medical document with SHA-256 hash deduplication.
  - `GET /documents`: List user's documents.
  - `GET /documents/:id`: Retrieve single document, extracted pages, and OCR text.
  - `POST /documents/:id/verify`: Confirm or correct uncertain extracted fields.
- **AI Copilot**:
  - `POST /assistant/chat`: Grounded clinical dialogue with source citations and safety guardrails.
- **Labs**:
  - `GET /labs`: Normalized lab results with reference intervals.
  - `GET /labs/:id/history`: Longitudinal biomarker trends.
- **Consents**:
  - `POST /consents`: Issue consent grant to doctor or hospital.
  - `DELETE /consents/:id`: Immediately revoke consent and terminate access.
- **FHIR Interoperability**:
  - `POST /fhir/import`: Ingest external FHIR R4 Bundle.
  - `GET /fhir/export`: Export patient records as FHIR collection.
- **ABDM**:
  - `POST /abdm/connect`: Connect ABHA address.
  - `GET /abdm/status`: Inspect official gateway connectivity.
