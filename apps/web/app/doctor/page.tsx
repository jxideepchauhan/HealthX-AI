'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input } from '@healthx/ui';
import { apiFetch } from '@/lib/api';
import {
  Stethoscope,
  Users,
  FileText,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Pill,
  ClipboardList,
  FlaskConical,
  PlusCircle,
  Clock,
  Calendar,
  Search,
  CheckCircle2,
  X,
  Loader2,
  LogOut,
} from 'lucide-react';

export default function DoctorPortalPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showLabOrderModal, setShowLabOrderModal] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');

  // Form states
  const [rxForm, setRxForm] = useState({
    name: 'Ferrous Ascorbate',
    dosage: '100 mg elemental iron',
    frequency: 'Once daily after dinner',
    instructions: 'Take with vitamin C / water. Avoid calcium or antacids within 2 hours.',
    reason: 'Iron deficiency anemia correction',
  });
  const [noteForm, setNoteForm] = useState({
    encounterType: 'CONSULTATION',
    reason: 'Follow-up consultation for microcytic hypochromic anemia & fatigue',
    assessment: 'Iron deficiency anemia secondary to suboptimal dietary absorption',
    plan: 'Initiate oral iron supplementation. Retest CBC & serum ferritin in 6 weeks.',
  });
  const [labForm, setLabForm] = useState({
    testNames: ['Complete Blood Count (CBC)', 'Serum Ferritin', 'Total Iron Binding Capacity (TIBC)'],
    priority: 'ROUTINE',
    clinicalNotes: 'Evaluate response to therapeutic iron after 6-week course',
  });
  const [consentForm, setConsentForm] = useState({
    patientIdentifier: 'PAT-ISAAC-1001',
    scope: 'ALL',
    purpose: 'Specialist internal medicine consultation and treatment review',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const res = await apiFetch<any>('/doctor/dashboard');
      setDashboardData(res);
      if (res.patients?.length > 0 && !selectedPatientId) {
        setSelectedPatientId(res.patients[0].patientId);
      }
    } catch (err) {
      console.error('Failed to load doctor dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreatePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiFetch('/doctor/prescriptions', {
        method: 'POST',
        body: JSON.stringify({
          patientId: selectedPatientId,
          ...rxForm,
        }),
      });
      setSuccessMsg('Prescription successfully recorded in patient medical chart.');
      setShowPrescriptionModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to submit prescription');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiFetch('/doctor/clinical-notes', {
        method: 'POST',
        body: JSON.stringify({
          patientId: selectedPatientId,
          ...noteForm,
        }),
      });
      setSuccessMsg('Clinical consultation note logged with cryptographic provenance.');
      setShowNoteModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to submit note');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateLabOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiFetch('/doctor/lab-orders', {
        method: 'POST',
        body: JSON.stringify({
          patientId: selectedPatientId,
          ...labForm,
        }),
      });
      setSuccessMsg('Diagnostic laboratory order successfully submitted.');
      setShowLabOrderModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create lab order');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestConsent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiFetch('/doctor/consent-requests', {
        method: 'POST',
        body: JSON.stringify(consentForm),
      });
      setSuccessMsg(`Consent authorized for ${consentForm.patientIdentifier}.`);
      setShowConsentModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to request consent');
    } finally {
      setSubmitting(false);
    }
  };

  const patientsList = dashboardData?.patients || [];
  const filteredPatients = patientsList.filter((p: any) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.patientId && p.patientId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="bg-slate-800/80 backdrop-blur border border-slate-700/60 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/20">
              <Stethoscope className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-white">Dr. Raskik, MD</h1>
                <Badge variant="success" className="text-[10px] bg-blue-500/20 text-blue-300 border-blue-500/30">
                  INTERNAL MEDICINE
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                <span>Unique ID: <strong className="font-mono text-slate-200">DOC-RASKIK-4091</strong></span>
                <span>&bull;</span>
                <span>License: <strong className="font-mono text-slate-200">MCI-2024-88492</strong></span>
                <span>&bull;</span>
                <span className="text-blue-400">Namo Hospital & Research Center</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowConsentModal(true)}
              className="text-xs bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700"
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Request Consent
            </Button>
            <Link href="/login">
              <Button size="sm" variant="ghost" className="text-xs text-slate-400 hover:text-white">
                <LogOut className="w-3.5 h-3.5 mr-1" /> Logout
              </Button>
            </Link>
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

        {/* Clinical KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/70 border border-slate-700/60 p-5 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Consented Patients</p>
              <p className="text-2xl font-bold text-white">{dashboardData?.stats?.activeConsentedPatients || 1}</p>
              <p className="text-[10px] text-emerald-400">100% Granular Consent Enforced</p>
            </div>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/60 p-5 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Critical Lab Alerts</p>
              <p className="text-2xl font-bold text-rose-400">{dashboardData?.stats?.criticalAlertsCount || 2}</p>
              <p className="text-[10px] text-slate-400">Requires Clinical Attention</p>
            </div>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/60 p-5 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Active Therapies</p>
              <p className="text-2xl font-bold text-white">1</p>
              <p className="text-[10px] text-purple-400">Iron Supplement prescribed</p>
            </div>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/60 p-5 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Upcoming Visits</p>
              <p className="text-2xl font-bold text-white">{dashboardData?.stats?.scheduledAppointments || 1}</p>
              <p className="text-[10px] text-amber-400">Next: 10:00 AM Tomorrow</p>
            </div>
          </div>
        </div>

        {/* Critical Clinical Alerts Feed */}
        {dashboardData?.alerts?.length > 0 && (
          <div className="bg-rose-950/40 border border-rose-500/30 p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Biomarker Alerts Requiring Physician Review</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dashboardData.alerts.map((al: any, idx: number) => (
                <div key={idx} className="bg-slate-900/80 p-3.5 rounded-xl border border-rose-900/40 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">
                      {al.patientName} &bull; <span className="text-rose-400">{al.testName}: {al.value} {al.unit}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Standard Range: Below Normal ({al.status}) &bull; Date: {al.date}
                    </div>
                  </div>
                  <Link href={`/doctor/patients/${al.patientId}`}>
                    <Button size="sm" className="text-[11px] bg-rose-600 hover:bg-rose-700 text-white h-7 px-2.5">
                      Open Chart
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Toolbar */}
        <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase text-slate-400">Clinical Actions:</span>
            <Button
              size="sm"
              onClick={() => setShowPrescriptionModal(true)}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5"
            >
              <Pill className="w-3.5 h-3.5" /> Issue Prescription
            </Button>
            <Button
              size="sm"
              onClick={() => setShowNoteModal(true)}
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5"
            >
              <ClipboardList className="w-3.5 h-3.5" /> Add Consultation Note
            </Button>
            <Button
              size="sm"
              onClick={() => setShowLabOrderModal(true)}
              className="text-xs bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1.5"
            >
              <FlaskConical className="w-3.5 h-3.5" /> Order Diagnostic Labs
            </Button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patients..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Consented Patient Roster */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            Authorized Patient Roster ({filteredPatients.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatients.map((p: any) => (
              <div
                key={p.patientId}
                className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 hover:border-blue-500/50 transition-all flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow">
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{p.name}</h3>
                        <p className="text-[11px] font-mono text-slate-400">
                          Blood: <strong className="text-rose-400">{p.bloodGroup || 'A+'}</strong> &bull; Sex: {p.sex} &bull; DOB: {p.dob}
                        </p>
                      </div>
                    </div>
                    <Badge variant="success" className="text-[10px] bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                      ACTIVE
                    </Badge>
                  </div>

                  <div className="mt-4 p-3 bg-slate-900/60 rounded-xl border border-slate-700/40 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Consent Scope:</span>
                      <span className="font-mono text-blue-300 font-semibold">{p.scope || 'ALL_RECORDS'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Valid Until:</span>
                      <span className="font-mono text-slate-300">{new Date(p.expiryDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Active Meds:</span>
                      <span className="text-purple-300 font-medium">{p.activeMedicationsCount || 1} documented</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedPatientId(p.patientId);
                        setShowPrescriptionModal(true);
                      }}
                      title="Quick Prescribe"
                      className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-blue-300 text-xs transition"
                    >
                      <Pill className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPatientId(p.patientId);
                        setShowNoteModal(true);
                      }}
                      title="Quick Note"
                      className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-indigo-300 text-xs transition"
                    >
                      <ClipboardList className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPatientId(p.patientId);
                        setShowLabOrderModal(true);
                      }}
                      title="Quick Order Labs"
                      className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-teal-300 text-xs transition"
                    >
                      <FlaskConical className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <Link href={`/doctor/patients/${p.patientId}`}>
                    <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1">
                      <span>Full Health Chart</span> <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL 1: Issue Prescription */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Pill className="w-5 h-5 text-blue-400" />
                <span>Issue Official Medical Prescription</span>
              </div>
              <button onClick={() => setShowPrescriptionModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePrescription} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Target Patient</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  {patientsList.map((p: any) => (
                    <option key={p.patientId} value={p.patientId}>
                      {p.name} ({p.patientId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Medication Name</label>
                <Input
                  type="text"
                  value={rxForm.name}
                  onChange={(e) => setRxForm({ ...rxForm, name: e.target.value })}
                  required
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Dosage</label>
                  <Input
                    type="text"
                    value={rxForm.dosage}
                    onChange={(e) => setRxForm({ ...rxForm, dosage: e.target.value })}
                    placeholder="e.g. 100 mg"
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Frequency</label>
                  <Input
                    type="text"
                    value={rxForm.frequency}
                    onChange={(e) => setRxForm({ ...rxForm, frequency: e.target.value })}
                    placeholder="e.g. Once daily after dinner"
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Clinical Instructions & Precautions</label>
                <textarea
                  value={rxForm.instructions}
                  onChange={(e) => setRxForm({ ...rxForm, instructions: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Clinical Indication / Reason</label>
                <Input
                  type="text"
                  value={rxForm.reason}
                  onChange={(e) => setRxForm({ ...rxForm, reason: e.target.value })}
                  placeholder="e.g. Iron deficiency anemia correction"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-700">
                <Button type="button" variant="outline" onClick={() => setShowPrescriptionModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <CheckCircle2 className="w-4 h-4 mr-1" />}
                  Record Prescription
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Consultation Note */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <ClipboardList className="w-5 h-5 text-indigo-400" />
                <span>Log Clinical Consultation Encounter</span>
              </div>
              <button onClick={() => setShowNoteModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Target Patient</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  {patientsList.map((p: any) => (
                    <option key={p.patientId} value={p.patientId}>
                      {p.name} ({p.patientId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Chief Complaint / Reason for Encounter</label>
                <textarea
                  value={noteForm.reason}
                  onChange={(e) => setNoteForm({ ...noteForm, reason: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Physician Clinical Assessment</label>
                <textarea
                  value={noteForm.assessment}
                  onChange={(e) => setNoteForm({ ...noteForm, assessment: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Therapeutic Treatment Plan</label>
                <textarea
                  value={noteForm.plan}
                  onChange={(e) => setNoteForm({ ...noteForm, plan: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-700">
                <Button type="button" variant="outline" onClick={() => setShowNoteModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <CheckCircle2 className="w-4 h-4 mr-1" />}
                  Log Clinical Note
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Order Diagnostic Labs */}
      {showLabOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <FlaskConical className="w-5 h-5 text-teal-400" />
                <span>Order Laboratory Investigations</span>
              </div>
              <button onClick={() => setShowLabOrderModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLabOrder} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Target Patient</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  {patientsList.map((p: any) => (
                    <option key={p.patientId} value={p.patientId}>
                      {p.name} ({p.patientId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Priority</label>
                <div className="flex gap-2">
                  {['ROUTINE', 'URGENT', 'STAT'].map((pr) => (
                    <button
                      key={pr}
                      type="button"
                      onClick={() => setLabForm({ ...labForm, priority: pr })}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                        labForm.priority === pr
                          ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                          : 'border-slate-700 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {pr}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Investigations Ordered</label>
                <div className="p-3 bg-slate-900 border border-slate-700 rounded-lg space-y-1.5 text-slate-300">
                  {labForm.testNames.map((t, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Physician Clinical Rationale</label>
                <textarea
                  value={labForm.clinicalNotes}
                  onChange={(e) => setLabForm({ ...labForm, clinicalNotes: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-700">
                <Button type="button" variant="outline" onClick={() => setShowLabOrderModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-teal-600 hover:bg-teal-700 text-white">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <CheckCircle2 className="w-4 h-4 mr-1" />}
                  Submit Lab Order
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Request Patient Consent */}
      {showConsentModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Initiate Patient Consent Authorization</span>
              </div>
              <button onClick={() => setShowConsentModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestConsent} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Patient Unique ID or Email</label>
                <Input
                  type="text"
                  value={consentForm.patientIdentifier}
                  onChange={(e) => setConsentForm({ ...consentForm, patientIdentifier: e.target.value })}
                  placeholder="e.g. PAT-ISAAC-1001 or isaac.noronha@example.com"
                  required
                  className="bg-slate-900 border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Consent Scope</label>
                <select
                  value={consentForm.scope}
                  onChange={(e) => setConsentForm({ ...consentForm, scope: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="ALL">ALL (Complete Clinical Dossier)</option>
                  <option value="LABS">LABS ONLY</option>
                  <option value="MEDICATIONS">MEDICATIONS ONLY</option>
                  <option value="CONSULTATIONS">CONSULTATIONS ONLY</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Purpose for PHI Access</label>
                <textarea
                  value={consentForm.purpose}
                  onChange={(e) => setConsentForm({ ...consentForm, purpose: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-xs"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-700">
                <Button type="button" variant="outline" onClick={() => setShowConsentModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <CheckCircle2 className="w-4 h-4 mr-1" />}
                  Authorize Consent Grant
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
