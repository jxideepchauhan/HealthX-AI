import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../../apps/api/src/app';

describe('HealthX AI API Integration Test Suite (Section 52, 76, 77)', () => {
  let authToken = '';
  const testIdentifier = 'isaac.noronha@example.com';

  it('GET /health returns 200 and service metadata', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('healthx-api');
  });

  it('GET /ready returns 200', async () => {
    const res = await request(app).get('/ready');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ready');
  });

  it('POST /api/v1/auth/request-otp dispatches OTP', async () => {
    const res = await request(app)
      .post('/api/v1/auth/request-otp')
      .send({ identifier: testIdentifier, role: 'PATIENT' });

    expect(res.status).toBe(200);
    expect(res.body.message).toContain('OTP sent successfully');
    expect(res.body.devOtpCode).toBeDefined();
  });

  it('POST /api/v1/auth/verify-otp acquires JWT session', async () => {
    // 1. Request OTP
    const reqRes = await request(app)
      .post('/api/v1/auth/request-otp')
      .send({ identifier: testIdentifier, role: 'PATIENT' });

    const devOtp = reqRes.body.devOtpCode;

    // 2. Verify OTP
    const res = await request(app)
      .post('/api/v1/auth/verify-otp')
      .send({ identifier: testIdentifier, otp: devOtp });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.identifier).toBe(testIdentifier);
    authToken = res.body.accessToken;
  });

  it('GET /api/v1/profile retrieves verified user profile', async () => {
    const res = await request(app)
      .get('/api/v1/profile')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.profile).toBeDefined();
    expect(res.body.profile.name).toBe('Isaac Richard Noronha');
    expect(res.body.profile.bloodGroup).toBe('A+');
  });

  it('GET /api/v1/labs retrieves seeded lab results with reference intervals', async () => {
    const res = await request(app)
      .get('/api/v1/labs')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.labs).toBeDefined();
    expect(res.body.labs.length).toBeGreaterThan(0);

    const hb = res.body.labs.find((l: any) => l.testName === 'Hemoglobin');
    expect(hb).toBeDefined();
    expect(hb.value).toBe('10.8');
    expect(hb.status).toBe('LOW');
  });

  it('POST /api/v1/assistant/chat delivers grounded response with citations', async () => {
    const res = await request(app)
      .post('/api/v1/assistant/chat')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ message: 'What was my hemoglobin?' });

    expect(res.status).toBe(200);
    expect(res.body.answer).toContain('10.8 g/dL');
    expect(res.body.citations).toHaveLength(1);
    expect(res.body.citations[0].documentTitle).toBe('CBC + Iron Studies [SYNTHETIC TEST DATA]');
  });

  it('POST /api/v1/doctor-visit/brief compiles structured brief', async () => {
    const res = await request(app)
      .post('/api/v1/doctor-visit/brief')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.brief).toBeDefined();
    expect(res.body.brief.patientSummary.name).toBe('Isaac Richard Noronha');
    expect(res.body.brief.labChanges.length).toBeGreaterThan(0);
    expect(res.body.brief.questionsForDoctor.length).toBeGreaterThan(0);
  });

  it('GET /api/v1/consents retrieves active patient consent', async () => {
    const res = await request(app)
      .get('/api/v1/consents')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.consents).toBeDefined();
    expect(res.body.consents.length).toBeGreaterThan(0);
    expect(res.body.consents[0].status).toBe('ACTIVE');
  });

  it('GET /api/v1/search executes multi-domain search', async () => {
    const res = await request(app)
      .get('/api/v1/search?q=Hemoglobin')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.results.labs.length).toBeGreaterThan(0);
  });

  it('blocks unauthenticated requests to protected endpoints', async () => {
    const res = await request(app).get('/api/v1/profile');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
