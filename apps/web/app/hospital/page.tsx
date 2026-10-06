'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input } from '@healthx/ui';
import { apiFetch, logout } from '@/lib/api';
import { LanguageSelector } from '@/components/LanguageSelector';
import {
  Building2,
  Upload,
  Users,
  ShieldCheck,
  FileText,
  CheckCircle2,
  Stethoscope,
  PlusCircle,
  Search,
  Activity,
  ArrowRight,
  Clock,
  Lock,
  LogOut,
  X,
  Loader2,
} from 'lucide-react';

export default function HospitalPortalPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [docForm, setDocForm] = useState({
    name: 'Dr. Anita Sharma',
    specialization: 'Cardiology',
    email: 'dr.anita@namohospital.org',
    phone: '+91-9816000001',
  });

  const [uploadForm, setUploadForm] = useState({
    patientId: 'patient-isaac-noronha-2026',
    title: 'Discharge Summary & Inpatient Chart',
    textContent:
      'NAMO HOSPITAL - INPATIENT CLINICAL SUMMARY\nPatient: Isaac Richard Noronha (PAT-ISAAC-1001)\nAttending Physician: Dr. Raskik (DOC-RASKIK-4091)\nClinical Course: Patient admitted for diagnostic evaluation of fatigue and occasional dizziness.\nLabs: Hemoglobin 10.8 g/dL (Low), Ferritin 12 ng/mL (Low).\nDiagnosis: Microcytic hypochromic anemia secondary to iron deficiency.\nDischarge Plan: Oral iron therapy commenced. Outpatient follow-up in 6 weeks.',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const res = await apiFetch<any>('/hospital/dashboard');
      setData(res);
    } catch (err) {
      console.error('Failed to load hospital dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOnboardDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiFetch('/hospital/doctors', {
        method: 'POST',
        body: JSON.stringify(docForm),
      });
      setSuccessMsg(`Physician ${docForm.name} successfully onboarded.`);
      setShowDoctorModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to onboard doctor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleHospitalUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiFetch('/hospital/documents', {
        method: 'POST',
        body: JSON.stringify(uploadForm),
      });
      setSuccessMsg('Institutional clinical record uploaded and verified against active consent.');
      setShowUploadModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to submit document');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="bg-slate-800/80 backdrop-blur border border-slate-700/60 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-purple-500/20">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-white">
                  Namo Hospital & Research Center
                </h1>
                <Badge variant="success" className="text-[10px] bg-purple-500/20 text-purple-300 border-purple-500/30">
                  NABH ACCREDITED
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                <span>Hospital Code: <strong className="font-mono text-slate-200">NABH-HOSP-2026-901</strong></span>
                <span>&bull;</span>
                <span>Unique ID: <strong className="font-mono text-slate-200">HOSP-NAMO-001</strong></span>
                <span>&bull;</span>
                <span>Location: Himachal Pradesh, India</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSelector variant="pill" />
            <Button
              size="sm"
              onClick={() => setShowUploadModal(true)}
              className="text-xs bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Upload className="w-3.5 h-3.5 mr-1" /> Institutional Upload
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowDoctorModal(true)}
              className="text-xs bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1 text-purple-400" /> Onboard Doctor
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => logout()}
              className="text-xs text-slate-400 hover:text-white"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" /> Logout
            </Button>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 p-4 rounded-xl text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Tabs for Hospital Portal */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-semibold">
          <Link href="/hospital" className="px-3 py-1.5 rounded-lg bg-purple-600 text-white">
            Overview Dashboard
          </Link>
          <Link href="/hospital/patients" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            Consented Patients Registry
          </Link>
          <Link href="/hospital/upload" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            Institutional Document Ingestion
          </Link>
          <Link href="/hospital/consents" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            Consent Governance Console
          </Link>
          <Link href="/hospital/audit" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            Tamper-Evident Audit Trails
          </Link>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/70 border border-slate-700/60 p-5 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Consented Patients</p>
              <p className="text-2xl font-bold text-white">{data?.stats?.totalConsentedPatients || 1}</p>
              <p className="text-[10px] text-purple-400">ABDM-compatible records</p>
            </div>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/60 p-5 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Affiliated Medical Staff</p>
              <p className="text-2xl font-bold text-white">{data?.stats?.affiliatedDoctors || 1}</p>
              <p className="text-[10px] text-blue-400">Licensed Practitioners</p>
            </div>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/60 p-5 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Institutional Documents</p>
              <p className="text-2xl font-bold text-white">{data?.stats?.totalHospitalDocuments || 1}</p>
              <p className="text-[10px] text-emerald-400">OCR & Vector Indexed</p>
            </div>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/60 p-5 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Audit Events Logged</p>
              <p className="text-2xl font-bold text-white">{data?.stats?.institutionalAuditEntries || 1}</p>
              <p className="text-[10px] text-amber-400">SHA-256 Chained Integrity</p>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Affiliated Doctors and Recent Consents */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Doctors Roster */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white text-base">Affiliated Physician Roster</h3>
              </div>
              <Button size="sm" onClick={() => setShowDoctorModal(true)} className="text-xs bg-blue-600 hover:bg-blue-700 text-white">
                <PlusCircle className="w-3.5 h-3.5 mr-1" /> Onboard
              </Button>
            </div>

            <div className="space-y-3">
              {(data?.doctors || [
                { id: 'doc-1', name: 'Dr. Raskik', specialization: 'Internal Medicine', email: 'dr.raskik@namohospital.org', phone: '+91-9816000000' }
              ]).map((d: any) => (
                <div key={d.id} className="p-4 bg-slate-900/60 border border-slate-700/40 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 font-bold flex items-center justify-center">
                      {d.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{d.name}</h4>
                      <p className="text-slate-400">{d.specialization} &bull; {d.email}</p>
                    </div>
                  </div>
                  <Badge variant="success" className="text-[10px] bg-emerald-500/20 text-emerald-300">
                    ACTIVE
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Active Consents */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Institutional Consent Registry</h3>
              </div>
              <Link href="/hospital/consents" className="text-xs text-purple-400 hover:text-purple-300 font-medium">
                View All →
              </Link>
            </div>

            <div className="space-y-3">
              {(data?.recentConsents || [
                { id: 'c-1', patientName: 'Isaac Richard Noronha', scope: 'ALL', expiryDate: '2027-09-15' }
              ]).map((c: any) => (
                <div key={c.id} className="p-4 bg-slate-900/60 border border-slate-700/40 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-white">{c.patientName}</h4>
                    <p className="text-slate-400 font-mono">Scope: {c.scope} &bull; Expires: {new Date(c.expiryDate).toLocaleDateString()}</p>
                  </div>
                  <Badge variant="success" className="text-[10px] bg-emerald-500/20 text-emerald-300">
                    AUTHORIZED
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Onboard Physician */}
      {showDoctorModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Stethoscope className="w-5 h-5 text-purple-400" />
                <span>Onboard Physician to Hospital Roster</span>
              </div>
              <button onClick={() => setShowDoctorModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOnboardDoctor} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Physician Full Name</label>
                <Input
                  type="text"
                  value={docForm.name}
                  onChange={(e) => setDocForm({ ...docForm, name: e.target.value })}
                  required
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Clinical Specialization</label>
                <Input
                  type="text"
                  value={docForm.specialization}
                  onChange={(e) => setDocForm({ ...docForm, specialization: e.target.value })}
                  required
                  placeholder="e.g. Cardiology, Internal Medicine, Oncology"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Official Hospital Email</label>
                <Input
                  type="email"
                  value={docForm.email}
                  onChange={(e) => setDocForm({ ...docForm, email: e.target.value })}
                  required
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Contact Number</label>
                <Input
                  type="text"
                  value={docForm.phone}
                  onChange={(e) => setDocForm({ ...docForm, phone: e.target.value })}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-700">
                <Button type="button" variant="outline" onClick={() => setShowDoctorModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-purple-600 hover:bg-purple-700 text-white">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <CheckCircle2 className="w-4 h-4 mr-1" />}
                  Register Physician
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Institutional Document Upload */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Upload className="w-5 h-5 text-purple-400" />
                <span>Submit Consent-Verified Record</span>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleHospitalUpload} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Target Patient ID</label>
                <Input
                  type="text"
                  value={uploadForm.patientId}
                  onChange={(e) => setUploadForm({ ...uploadForm, patientId: e.target.value })}
                  required
                  className="bg-slate-900 border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Document Title</label>
                <Input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  required
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Clinical Content / Report Text</label>
                <textarea
                  value={uploadForm.textContent}
                  onChange={(e) => setUploadForm({ ...uploadForm, textContent: e.target.value })}
                  rows={5}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-mono text-[11px]"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-700">
                <Button type="button" variant="outline" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-purple-600 hover:bg-purple-700 text-white">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <CheckCircle2 className="w-4 h-4 mr-1" />}
                  Upload to Patient Chart
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
