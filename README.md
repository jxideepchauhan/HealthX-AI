# HEALTHX AI — AI-Powered Personal Health Copilot

> **"Your Health. Connected. Understood."**

HealthX AI is a full-stack, production-style intelligent personal health-record platform that transforms fragmented healthcare documents into a structured, searchable, and explainable health journey.

---

## Key Features

1. **Medical Record Intelligence**: Automated ingestion, SHA-256 deduplication, and OCR extraction for printed and handwritten records.
2. **AI Health Copilot**: Grounded clinical dialogue with document and page citations. Never invents diagnoses or alters medications.
3. **Unified Health Journey**: Chronological graph connecting consultations, diagnostic reports, observations, vitals, and prescriptions.
4. **Lab Intelligence**: Normalized biomarkers, automatic reference interval matching, and historical longitudinal charts.
5. **Doctor Visit Mode**: Generates clinical dossiers summarizing recent biomarker changes, active medications, and consultation questions.
6. **Consent Engine**: Granular, time-bound consent controls with immediate revocation.
7. **FHIR R4 Interoperability**: Bi-directional mapping, validation, and export of HL7 FHIR Release 4 resources.
8. **ABDM Integration Ready**: Architectural support for Ayushman Bharat Digital Mission (ABDM) and ABHA ID.
9. **Role-Based Portals**: Dedicated workspaces for Patients, Doctors, Hospitals, and ML Engineers.
10. **Machine Learning Pipeline**: Custom trainable document classifier and medical NER models with measured evaluation metrics.

---

## Monorepo Architecture

```
healthx-ai/
├── apps/
│   ├── web/          # Next.js responsive web application & portals
│   ├── api/          # Express REST API gateway & processing pipeline
│   └── ml-service/   # Python FastAPI service & ML training pipeline
├── packages/
│   ├── database/     # Prisma ORM, migrations & verified seed dataset
│   ├── types/        # Domain TypeScript definitions
│   ├── shared/       # Normalization, validation & error formatting
│   ├── security/     # Cryptographic OTP, JWT, RBAC & consent guards
│   ├── ai/           # RAG retriever, grounding validator & LLM providers
│   ├── fhir/         # FHIR R4 models, serializer, parser & validator
│   └── ui/           # Accessible React component library
├── infra/
│   ├── docker/       # Production Dockerfiles & docker-compose.yml
│   ├── migrations/   # PostgreSQL schema & pgvector scripts
│   └── monitoring/   # Prometheus configuration
├── docs/             # Complete architectural and API specifications
└── tests/            # Security, RAG grounding, and FHIR test suites
```

---

## Quickstart & Local Setup

### 1. Prerequisites
- Node.js (v20+)
- Python (v3.11+)

### 2. Setup Database & Seed
```bash
npm install
npm --workspace=@healthx/database run db:push
npm --workspace=@healthx/database run db:seed
```

### 3. Run Automated Tests
```bash
# Run Security, RAG Grounding, and FHIR unit tests
npm test

# Run ML Pytest validation suite
npm run test:ml
```

### 4. Start Services
```bash
# Start API (port 4000)
npm run dev:api

# Start Web Frontend (port 3000)
npm run dev:web

# Start ML Service (port 8000)
npm run dev:ml
```

Open [http://localhost:3000](http://localhost:3000) in your browser.  
Open [http://localhost:4000/docs](http://localhost:4000/docs) for the interactive Swagger OpenAPI UI.

---

## Clinical Safety Principle
HealthX AI is **NOT an autonomous medical decision maker**. The AI explains and organizes authorized healthcare information. It does not independently diagnose, prescribe, or recommend stopping medications. When records lack sufficient evidence, it explicitly states uncertainty.
