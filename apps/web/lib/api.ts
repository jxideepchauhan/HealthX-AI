/**
 * HealthX Web API Client
 * Centralized fetch wrapper with automatic JWT token attachment,
 * session management, role-based persona switching, and resilient
 * fixed demo data fallback for standalone 1-app operation.
 */

import {
  DEMO_PATIENT,
  DEMO_LABS,
  DEMO_MEDICATIONS,
  DEMO_DOCUMENTS,
  DEMO_TIMELINE,
  DEMO_APPOINTMENTS,
  DEMO_CONSENTS,
  DEMO_DOCTOR_DASHBOARD,
  DEMO_HOSPITAL_DASHBOARD,
  DEMO_AUDIT_LOGS,
  generateDemoCopilotAnswer,
} from './demoData';

export const API_BASE = '/api/v1';

export interface StoredUser {
  id?: string;
  name?: string;
  identifier?: string;
  uniqueId?: string;
  role: 'PATIENT' | 'DOCTOR' | 'HOSPITAL';
  token?: string;
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('healthx_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function ensureSession(desiredRole: 'PATIENT' | 'DOCTOR' | 'HOSPITAL' = 'PATIENT'): Promise<StoredUser> {
  if (typeof window === 'undefined') {
    return {
      role: desiredRole,
      name: desiredRole === 'DOCTOR' ? 'Dr. Raskik, MD' : desiredRole === 'HOSPITAL' ? 'Namo Hospital & Research Center' : 'Isaac Richard Noronha',
      uniqueId: desiredRole === 'DOCTOR' ? 'DOC-RASKIK-4091' : desiredRole === 'HOSPITAL' ? 'HOSP-NAMO-001' : 'PAT-ISAAC-1001',
    };
  }

  const existing = getStoredUser();
  if (existing && existing.role === desiredRole) {
    return existing;
  }

  // Set default demo session credentials
  const demoUsers: Record<'PATIENT' | 'DOCTOR' | 'HOSPITAL', StoredUser> = {
    PATIENT: {
      name: 'Isaac Richard Noronha',
      identifier: 'PAT-ISAAC-1001',
      uniqueId: 'PAT-ISAAC-1001',
      role: 'PATIENT',
    },
    DOCTOR: {
      name: 'Dr. Raskik, MD',
      identifier: 'DOC-RASKIK-4091',
      uniqueId: 'DOC-RASKIK-4091',
      role: 'DOCTOR',
    },
    HOSPITAL: {
      name: 'Namo Hospital & Research Center',
      identifier: 'HOSP-NAMO-001',
      uniqueId: 'HOSP-NAMO-001',
      role: 'HOSPITAL',
    },
  };

  const user = demoUsers[desiredRole] || demoUsers.PATIENT;
  localStorage.setItem('healthx_user', JSON.stringify(user));
  window.dispatchEvent(new CustomEvent('healthx_auth_change', { detail: user }));
  return user;
}

export function switchDemoPersona(role: 'PATIENT' | 'DOCTOR' | 'HOSPITAL') {
  if (typeof window === 'undefined') return;
  ensureSession(role);
  if (role === 'DOCTOR') {
    window.location.href = '/doctor';
  } else if (role === 'HOSPITAL') {
    window.location.href = '/hospital';
  } else {
    window.location.href = '/dashboard';
  }
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('healthx_token');
    localStorage.removeItem('healthx_user');
    window.dispatchEvent(new CustomEvent('healthx_auth_change', { detail: null }));
    window.location.href = '/login';
  }
}

function getClientDemoFallback(path: string, options: RequestInit = {}): any {
  const p = path.split('?')[0];

  if (p === 'profile') return { profile: DEMO_PATIENT };
  if (p === 'labs') return { labs: DEMO_LABS };
  if (p.startsWith('labs/')) {
    const id = p.split('/')[1];
    if (p.endsWith('/history')) return { history: DEMO_LABS[0].history };
    return { lab: DEMO_LABS.find((l) => l.id === id) || DEMO_LABS[0] };
  }
  if (p === 'medications') return { medications: DEMO_MEDICATIONS };
  if (p === 'documents') return { documents: DEMO_DOCUMENTS };
  if (p.startsWith('documents/')) {
    const id = p.split('/')[1];
    return { document: DEMO_DOCUMENTS.find((d) => d.id === id) || DEMO_DOCUMENTS[0] };
  }
  if (p === 'timeline') return { events: DEMO_TIMELINE };
  if (p === 'appointments') return { appointments: DEMO_APPOINTMENTS };
  if (p === 'consents') return { consents: DEMO_CONSENTS };
  if (p === 'doctor/dashboard') return DEMO_DOCTOR_DASHBOARD;
  if (p.startsWith('doctor/patients/')) return { patient: DEMO_DOCTOR_DASHBOARD.patients[0] };
  if (p === 'hospital/dashboard') return DEMO_HOSPITAL_DASHBOARD;
  if (p === 'hospital/patients') return { patients: DEMO_HOSPITAL_DASHBOARD.patients };
  if (p === 'hospital/doctors') return { doctors: DEMO_HOSPITAL_DASHBOARD.doctors };
  if (p === 'hospital/consents') return { consents: DEMO_CONSENTS };
  if (p === 'hospital/audit' || p === 'audit') return { auditEvents: DEMO_AUDIT_LOGS };

  if (p === 'assistant/chat') {
    let body: any = {};
    try {
      if (typeof options.body === 'string') body = JSON.parse(options.body);
    } catch {
      // fallback
    }
    return generateDemoCopilotAnswer(body.message || '', body.language || 'English');
  }

  if (p === 'doctor-visit/brief') {
    return {
      brief: {
        patientName: DEMO_PATIENT.name,
        age: 18,
        chiefComplaint: 'Afternoon tiredness and low energy',
        recentChanges: 'Started Ferrous Ascorbate 100mg on 2026-09-16',
        abnormalLabs: ['Hemoglobin: 10.8 g/dL (Low)', 'Serum Ferritin: 12 ng/mL (Critical Low)'],
        activeMedications: ['Ferrous Ascorbate 100mg', 'Vitamin C 500mg'],
        suggestedDoctorQuestions: [
          'How long should I continue oral iron therapy before repeat blood test?',
          'Are there any dietary interactions I should be aware of with iron?',
        ],
      },
    };
  }

  return undefined;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('healthx_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMsg = data?.error?.message || `Request failed with status ${res.status}`;
      throw new Error(errorMsg);
    }

    return data as T;
  } catch (err: any) {
    // If network or server error, gracefully provide fixed demo response
    const cleanPath = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const fallback = getClientDemoFallback(cleanPath, options);
    if (fallback !== undefined) {
      return fallback as T;
    }
    throw err;
  }
}
