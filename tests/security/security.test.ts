import { describe, it, expect } from 'vitest';
import {
  canAccessResource,
  generateOTP,
  hashOTP,
  verifyOTP,
  generateSalt,
  checkRateLimit,
  sanitizeFileName,
  createAuditLog,
} from '@healthx/security';
import type { ConsentRecord, UserRole } from '@healthx/types';

describe('HealthX AI Security & Access Control Tests (Sections 77 & 78)', () => {
  const patientA = 'patient-user-a';
  const patientB = 'patient-user-b';
  const doctorId = 'doctor-raskik-id';
  const hospitalId = 'hospital-namo-id';
  const adminId = 'admin-user-id';

  it('allows a patient to access their own clinical records', () => {
    const access = canAccessResource(patientA, 'PATIENT', patientA, 'ALL', []);
    expect(access.allowed).toBe(true);
  });

  it('CRITICAL: blocks User A from accessing User B records (IDOR Prevention)', () => {
    const access = canAccessResource(patientA, 'PATIENT', patientB, 'ALL', []);
    expect(access.allowed).toBe(false);
  });

  it('CRITICAL: blocks Doctor without active consent from accessing patient data', () => {
    const access = canAccessResource(doctorId, 'DOCTOR', patientA, 'ALL', []);
    expect(access.allowed).toBe(false);
    expect(access.reason).toContain('No active, non-expired consent grant found');
  });

  it('allows Doctor access when an ACTIVE, valid consent exists', () => {
    const activeConsent: ConsentRecord = {
      id: 'consent-001',
      patientId: patientA,
      recipientId: doctorId,
      recipientName: 'Dr. Raskik',
      recipientRole: 'DOCTOR',
      scope: 'ALL',
      startDate: '2026-01-01T00:00:00.000Z',
      expiryDate: '2027-01-01T00:00:00.000Z',
      status: 'ACTIVE',
      purpose: 'Clinical treatment',
      createdAt: '2026-01-01T00:00:00.000Z',
    };

    const access = canAccessResource(doctorId, 'DOCTOR', patientA, 'ALL', [activeConsent]);
    expect(access.allowed).toBe(true);
  });

  it('CRITICAL: REVOKED consent immediately blocks access', () => {
    const revokedConsent: ConsentRecord = {
      id: 'consent-001',
      patientId: patientA,
      recipientId: doctorId,
      recipientName: 'Dr. Raskik',
      recipientRole: 'DOCTOR',
      scope: 'ALL',
      startDate: '2026-01-01T00:00:00.000Z',
      expiryDate: '2027-01-01T00:00:00.000Z',
      status: 'REVOKED', // Patient revoked consent
      purpose: 'Clinical treatment',
      createdAt: '2026-01-01T00:00:00.000Z',
    };

    const access = canAccessResource(doctorId, 'DOCTOR', patientA, 'ALL', [revokedConsent]);
    expect(access.allowed).toBe(false);
  });

  it('CRITICAL: EXPIRED consent blocks access', () => {
    const expiredConsent: ConsentRecord = {
      id: 'consent-002',
      patientId: patientA,
      recipientId: doctorId,
      recipientName: 'Dr. Raskik',
      recipientRole: 'DOCTOR',
      scope: 'ALL',
      startDate: '2020-01-01T00:00:00.000Z',
      expiryDate: '2021-01-01T00:00:00.000Z', // In the past
      status: 'ACTIVE',
      purpose: 'Clinical treatment',
      createdAt: '2020-01-01T00:00:00.000Z',
    };

    const access = canAccessResource(doctorId, 'DOCTOR', patientA, 'ALL', [expiredConsent]);
    expect(access.allowed).toBe(false);
  });

  it('CRITICAL: Admin is strictly prohibited from silently viewing clinical records (Section 81)', () => {
    const access = canAccessResource(adminId, 'ADMIN', patientA, 'ALL', []);
    expect(access.allowed).toBe(false);
    expect(access.reason).toContain('Administrators are strictly prohibited');
  });

  it('verifies cryptographic OTP generation, salt, and verification', () => {
    const otp = generateOTP();
    expect(otp).toHaveLength(6);

    const salt = generateSalt();
    const hash = hashOTP(otp, salt);
    expect(verifyOTP(otp, hash, salt)).toBe(true);
    expect(verifyOTP('000000', hash, salt)).toBe(false);
  });

  it('sanitizes file names against path traversal abuse', () => {
    const malicious = '../../../../etc/passwd.pdf';
    const sanitized = sanitizeFileName(malicious);
    expect(sanitized).not.toContain('..');
    expect(sanitized).not.toContain('/');
  });

  it('enforces append-only tamper-evident audit logging chain', () => {
    const log1 = createAuditLog('user-1', 'PATIENT', 'CREATE', 'Document', 'doc-1', 'SUCCESS');
    const log2 = createAuditLog('user-1', 'PATIENT', 'VIEW', 'Document', 'doc-1', 'SUCCESS');

    expect(log1.hash).toBeDefined();
    expect(log2.previousHash).toBe(log1.hash);
  });
});
