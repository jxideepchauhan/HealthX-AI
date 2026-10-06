# HealthX AI — Database Architecture & Schemas

## Database Schema (Prisma ORM)
HealthX AI models 30 clinical and system entities:
- `User`, `Profile`, `EmergencyContact`
- `Document`, `DocumentPage`, `OCRResult`, `ExtractedEntity`
- `LabResult`, `Observation`, `Medication`, `MedicationRequest`, `Condition`, `Encounter`, `DiagnosticReport`, `Procedure`
- `TimelineEvent`, `Doctor`, `Hospital`, `Organization`, `Appointment`
- `Consent`, `AuditEvent`, `Conversation`, `Message`, `Citation`, `Embedding`, `ABHAConnection`, `FHIRResource`, `ModelVersion`, `ProcessingJob`

## Multi-Tenancy Enforcement
Every clinical record table includes `userId`. Application guards and query filters enforce:
```typescript
where: { userId: current_user_id }
```
Cross-user access is blocked unless valid active consent is presented.

## PostgreSQL & pgvector Production Support
- PostgreSQL Docker image: `pgvector/pgvector:pg16`
- Vector search: Dense embedding vectors stored with pgvector indexes for similarity matching.
- SQLite fallback: Provides zero-dependency instant local execution and automated test passing without external server requirements.
