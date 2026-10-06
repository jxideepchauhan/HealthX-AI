import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import crypto from 'node:crypto';
import swaggerUi from 'swagger-ui-express';

import { openApiSpec } from './openapi/spec';
import { errorHandler } from './middleware/errorHandler';

import { authRouter } from './routes/auth';
import { profileRouter } from './routes/profile';
import { documentsRouter } from './routes/documents';
import { labsRouter } from './routes/labs';
import { medicationsRouter } from './routes/medications';
import { timelineRouter } from './routes/timeline';
import { assistantRouter } from './routes/assistant';
import { doctorRouter } from './routes/doctor';
import { hospitalRouter } from './routes/hospital';
import { consentsRouter } from './routes/consents';
import { auditRouter } from './routes/audit';
import { appointmentsRouter } from './routes/appointments';
import { abdmRouter } from './routes/abdm';
import { fhirRouter } from './routes/fhir';
import { searchRouter } from './routes/search';
import { clinicalRouter } from './routes/clinical';

export const app = express();

// 1. Security & Parsing Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Allow Swagger UI assets in dev
}));
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request ID injection
app.use((req, _res, next) => {
  req.requestId = (req.headers['x-request-id'] as string) || crypto.randomUUID();
  next();
});

// 2. Health & Readiness Check Endpoints (Section 57)
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'healthx-api',
    version: '1.0.0',
  });
});

app.get('/ready', (_req, res) => {
  res.json({
    status: 'ready',
    timestamp: new Date().toISOString(),
    database: 'connected',
  });
});

// 3. OpenAPI Documentation UI (Section 53)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.get('/openapi.json', (_req, res) => res.json(openApiSpec));

// 4. API v1 Routes (Section 52)
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/profile', profileRouter);
app.use('/api/v1/documents', documentsRouter);
app.use('/api/v1/labs', labsRouter);
app.use('/api/v1/medications', medicationsRouter);
app.use('/api/v1/timeline', timelineRouter);
app.use('/api/v1/assistant', assistantRouter);
app.use('/api/v1/doctor', doctorRouter);
app.use('/api/v1/hospital', hospitalRouter);
app.use('/api/v1/consents', consentsRouter);
app.use('/api/v1/audit', auditRouter);
app.use('/api/v1/appointments', appointmentsRouter);
app.use('/api/v1/abdm', abdmRouter);
app.use('/api/v1/fhir', fhirRouter);
app.use('/api/v1/search', searchRouter);
app.use('/api/v1', clinicalRouter);

// 5. Global Standardized Error Handler (Section 54)
app.use(errorHandler);
