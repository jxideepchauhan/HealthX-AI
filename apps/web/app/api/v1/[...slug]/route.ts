import { NextRequest, NextResponse } from 'next/server';
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
} from '@/lib/demoData';

// In-memory runtime state for mutations during the session
let appointments = [...DEMO_APPOINTMENTS];
let medications = [...DEMO_MEDICATIONS];
let consents = [...DEMO_CONSENTS];
let documents = [...DEMO_DOCUMENTS];

async function handleRequest(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const path = (params.slug || []).join('/');
  const method = req.method;

  // 1. Try forwarding to backend if running, otherwise gracefully fallback to fixed demo data
  const backendUrl = process.env.BACKEND_API_URL;
  if (backendUrl) {
    try {
      const url = `${backendUrl}/api/v1/${path}${req.nextUrl.search}`;
      const backendRes = await fetch(url, {
        method,
        headers: {
          'Content-Type': req.headers.get('content-type') || 'application/json',
          Authorization: req.headers.get('authorization') || '',
        },
        body: method !== 'GET' && method !== 'HEAD' ? await req.text() : undefined,
      });
      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }
    } catch {
      // Fallback to fixed demo data below
    }
  }

  // 2. Fixed Demo Handlers
  try {
    let body: any = {};
    if (method === 'POST' || method === 'PUT') {
      try {
        body = await req.json();
      } catch {
        body = {};
      }
    }

    // --- AUTH ---
    if (path === 'auth/login-password') {
      const role = body.role || 'PATIENT';
      const user =
        role === 'DOCTOR'
          ? { role: 'DOCTOR', name: 'Dr. Raskik, MD', identifier: 'DOC-RASKIK-4091', uniqueId: 'DOC-RASKIK-4091' }
          : role === 'HOSPITAL'
          ? { role: 'HOSPITAL', name: 'Namo Hospital & Research Center', identifier: 'HOSP-NAMO-001', uniqueId: 'HOSP-NAMO-001' }
          : { role: 'PATIENT', name: 'Isaac Richard Noronha', identifier: 'PAT-ISAAC-1001', uniqueId: 'PAT-ISAAC-1001' };

      return NextResponse.json({
        accessToken: `fixed-demo-jwt-token-${role.toLowerCase()}`,
        user,
      });
    }

    if (path === 'auth/request-otp') {
      return NextResponse.json({
        devOtpCode: '123456',
        message: 'One-Time Password generated successfully. Default demo OTP is 123456.',
      });
    }

    if (path === 'auth/verify-otp') {
      const role = body.role || 'PATIENT';
      const user =
        role === 'DOCTOR'
          ? { role: 'DOCTOR', name: 'Dr. Raskik, MD', identifier: 'DOC-RASKIK-4091', uniqueId: 'DOC-RASKIK-4091' }
          : role === 'HOSPITAL'
          ? { role: 'HOSPITAL', name: 'Namo Hospital & Research Center', identifier: 'HOSP-NAMO-001', uniqueId: 'HOSP-NAMO-001' }
          : { role: 'PATIENT', name: 'Isaac Richard Noronha', identifier: 'PAT-ISAAC-1001', uniqueId: 'PAT-ISAAC-1001' };

      return NextResponse.json({
        accessToken: `fixed-demo-jwt-token-${role.toLowerCase()}`,
        user,
      });
    }

    // --- PROFILE ---
    if (path === 'profile') {
      if (method === 'POST' || method === 'PUT') {
        Object.assign(DEMO_PATIENT, body);
        return NextResponse.json({ profile: DEMO_PATIENT });
      }
      return NextResponse.json({ profile: DEMO_PATIENT });
    }

    // --- LABS ---
    if (path === 'labs') {
      return NextResponse.json({ labs: DEMO_LABS });
    }
    if (path.startsWith('labs/')) {
      const parts = path.split('/');
      const labId = parts[1];
      if (parts[2] === 'history') {
        const lab = DEMO_LABS.find((l) => l.id === labId) || DEMO_LABS[0];
        return NextResponse.json({ history: lab.history || [] });
      }
      const lab = DEMO_LABS.find((l) => l.id === labId) || DEMO_LABS[0];
      return NextResponse.json({ lab });
    }

    // --- MEDICATIONS ---
    if (path === 'medications') {
      if (method === 'POST') {
        const newMed = {
          id: 'med-' + Date.now(),
          name: body.name || 'New Medication',
          dosage: body.dosage || 'Standard dose',
          frequency: body.frequency || 'Once daily',
          status: 'ACTIVE',
          startDate: new Date().toISOString(),
          prescribedBy: body.prescribedBy || 'Dr. Raskik',
          instructions: body.instructions || 'Take as directed.',
          reason: body.reason || 'Therapeutic maintenance',
        };
        medications.push(newMed);
        return NextResponse.json({ medication: newMed });
      }
      return NextResponse.json({ medications });
    }
    if (path.startsWith('medications/')) {
      const medId = path.split('/')[1];
      if (method === 'DELETE') {
        medications = medications.filter((m) => m.id !== medId);
        return NextResponse.json({ success: true, message: 'Medication removed.' });
      }
    }

    // --- DOCUMENTS ---
    if (path === 'documents') {
      return NextResponse.json({ documents });
    }
    if (path.startsWith('documents/')) {
      const parts = path.split('/');
      const docId = parts[1];
      if (parts[2] === 'verify') {
        return NextResponse.json({ success: true, status: 'VERIFIED' });
      }
      if (method === 'DELETE') {
        documents = documents.filter((d) => d.id !== docId);
        return NextResponse.json({ success: true, message: 'Document deleted.' });
      }
      const doc = documents.find((d) => d.id === docId) || documents[0];
      return NextResponse.json({ document: doc });
    }

    // --- TIMELINE / JOURNEY ---
    if (path === 'timeline') {
      return NextResponse.json({ events: DEMO_TIMELINE });
    }

    // --- APPOINTMENTS ---
    if (path === 'appointments') {
      if (method === 'POST') {
        const newAppt = {
          id: 'appt-' + Date.now(),
          doctorName: body.doctorName || 'Dr. Raskik',
          hospitalName: body.hospitalName || 'Namo Hospital',
          appointmentDate: body.appointmentDate || new Date(Date.now() + 7 * 86400000).toISOString(),
          reason: body.reason || 'General Consultation',
          notes: body.notes || '',
          status: 'SCHEDULED',
        };
        appointments.push(newAppt);
        return NextResponse.json({ appointment: newAppt });
      }
      return NextResponse.json({ appointments });
    }
    if (path.startsWith('appointments/')) {
      const apptId = path.split('/')[1];
      if (method === 'DELETE') {
        appointments = appointments.filter((a) => a.id !== apptId);
        return NextResponse.json({ success: true, message: 'Appointment cancelled.' });
      }
    }

    // --- CONSENTS ---
    if (path === 'consents') {
      if (method === 'POST') {
        const newConsent = {
          id: 'consent-' + Date.now(),
          grantedToName: body.grantedToName || 'Dr. Raskik, MD',
          grantedToRole: body.grantedToRole || 'DOCTOR',
          identifier: body.identifier || 'DOC-RASKIK-4091',
          purpose: body.purpose || 'Clinical care and review',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 365 * 86400000).toISOString(),
        };
        consents.push(newConsent);
        return NextResponse.json({ consent: newConsent });
      }
      return NextResponse.json({ consents });
    }
    if (path.startsWith('consents/')) {
      const consentId = path.split('/')[1];
      if (method === 'DELETE') {
        consents = consents.filter((c) => c.id !== consentId);
        return NextResponse.json({ success: true, message: 'Consent revoked.' });
      }
    }

    // --- ASSISTANT / CHAT ---
    if (path === 'assistant/chat') {
      const query = body.message || 'What was my hemoglobin?';
      const lang = body.language || 'English';
      const response = generateDemoCopilotAnswer(query, lang);
      return NextResponse.json(response);
    }

    // --- DOCTOR PORTAL ---
    if (path === 'doctor/dashboard') {
      return NextResponse.json(DEMO_DOCTOR_DASHBOARD);
    }
    if (path.startsWith('doctor/patients/')) {
      return NextResponse.json({ patient: DEMO_DOCTOR_DASHBOARD.patients[0] });
    }
    if (path === 'doctor/prescriptions') {
      return NextResponse.json({ success: true, message: 'Prescription successfully authorized and saved.' });
    }
    if (path === 'doctor/clinical-notes') {
      return NextResponse.json({ success: true, message: 'Encounter note recorded in medical history.' });
    }
    if (path === 'doctor/lab-orders') {
      return NextResponse.json({ success: true, message: 'Laboratory diagnostic order dispatched.' });
    }
    if (path === 'doctor/consent-requests') {
      return NextResponse.json({ success: true, message: 'Patient consent granted.' });
    }

    // --- HOSPITAL PORTAL ---
    if (path === 'hospital/dashboard') {
      return NextResponse.json(DEMO_HOSPITAL_DASHBOARD);
    }
    if (path === 'hospital/patients') {
      return NextResponse.json({ patients: DEMO_HOSPITAL_DASHBOARD.patients });
    }
    if (path === 'hospital/doctors') {
      if (method === 'POST') {
        return NextResponse.json({ success: true, message: 'Doctor successfully credentialed.' });
      }
      return NextResponse.json({ doctors: DEMO_HOSPITAL_DASHBOARD.doctors });
    }
    if (path === 'hospital/documents') {
      return NextResponse.json({ success: true, message: 'Institutional clinical file verified and uploaded.' });
    }
    if (path === 'hospital/consents') {
      return NextResponse.json({ consents: DEMO_CONSENTS });
    }
    if (path === 'hospital/audit') {
      return NextResponse.json({ auditEvents: DEMO_AUDIT_LOGS });
    }

    // --- GENERAL AUDIT ---
    if (path === 'audit') {
      return NextResponse.json({ auditEvents: DEMO_AUDIT_LOGS });
    }

    // --- DOCTOR VISIT BRIEF ---
    if (path === 'doctor-visit/brief') {
      return NextResponse.json({
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
      });
    }

    // --- ABDM / ABHA ---
    if (path.startsWith('abdm/')) {
      return NextResponse.json({
        message: 'ABHA ID 91-8472-1092-4821 linked and verified with Ayushman Bharat Digital Mission gateway.',
        status: 'LINKED',
        abhaId: DEMO_PATIENT.abhaId,
      });
    }

    // Default fallback
    return NextResponse.json({ message: 'Success', status: 'OK' });
  } catch (err: any) {
    return NextResponse.json(
      { error: { message: err?.message || 'Server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
export const OPTIONS = () => NextResponse.json({ ok: true });
