# HealthX AI — System Architecture

## Overview
HealthX AI is a production-style intelligent personal health-record platform designed to transform fragmented medical documents into a structured, searchable, and explainable health journey.

## Core Architecture Diagram (Section 88)
```
                    HEALTHX AI
                         |
                  Authentication (Passwordless OTP / JWT)
                         |
                    Consent Layer (Scopes: ALL, LABS, RX, etc.)
                         |
                    API Gateway (Express / REST / OpenAPI 3.0)
                         |
       +-----------------+----------------+
       |                 |                |
   Documents          Health DB        AI Copilot
       |                 |                |
      OCR            Health Graph        RAG
       |                 |                |
   ML Engine        FHIR Layer         LLM (Local / OpenAI)
       |                 |                |
       +-----------------+----------------+
                         |
                  Source Grounding
                         |
                  Patient Response
```

## External Interoperability
```
ABHA / ABDM Gateway
         |
Consent Artifact Request
         |
FHIR R4 Compatible Records
         |
ABDM Connector (Mock & Official Adapter)
         |
HealthX AI Structured Store
```

## Monorepo Layout
- `apps/web`: Next.js frontend (Patient, Doctor, Hospital, ML Admin portals).
- `apps/api`: REST API gateway with background processing jobs and provider abstractions.
- `apps/ml-service`: Python FastAPI microservice for OCR post-processing, document classification, medical NER, embeddings, and live model evaluation.
- `packages/database`: Prisma ORM with SQLite (local dev/test) and PostgreSQL with pgvector (production/Docker).
- `packages/security`: Cryptographic OTP, JWT tokens, RBAC, consent evaluation engine, and tamper-evident audit logging.
- `packages/ai`: RAG retriever, clinical grounding validator, citation generator, and multi-lingual dictionary.
- `packages/fhir`: FHIR Release 4 models, serializers, parsers, and validation rules.
- `packages/types`: Domain interfaces.
- `packages/ui`: Accessible Tailwind & React component library.
