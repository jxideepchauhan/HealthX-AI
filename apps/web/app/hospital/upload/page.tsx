'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input } from '@healthx/ui';
import { apiFetch } from '@/lib/api';
import {
  Upload,
  ArrowLeft,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building2,
} from 'lucide-react';

export default function HospitalUploadPage() {
  const [patientId, setPatientId] = useState('patient-isaac-noronha-2026');
  const [patients, setPatients] = useState<any[]>([]);
  const [title, setTitle] = useState('Hospital Laboratory Summary & Clinical Observation');
  const [docCategory, setDocCategory] = useState('LAB_REPORT');
  const [textContent, setTextContent] = useState(
    'NAMO HOSPITAL - DEPARTMENT OF PATHOLOGY & LABORATORY MEDICINE\nPatient: Isaac Richard Noronha (PAT-ISAAC-1001)\nOrdering Physician: Dr. Raskik\nReport: Complete Blood Count & Serum Ferritin\nHemoglobin: 10.8 g/dL (Reference Range: 13.0 - 17.0 g/dL) [LOW]\nSerum Ferritin: 12 ng/mL (Reference Range: 30 - 400 ng/mL) [LOW]\nMCV: 76 fL (Reference Range: 80 - 100 fL) [LOW]\nWBC: 7200 /µL (Normal)\nImpression: Consistent with microcytic iron deficiency anemia.\nVerification: Verified by Chief Pathologist, Namo Hospital.'
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  React.useEffect(() => {
    async function loadPatients() {
      try {
        const res = await apiFetch<{ patients: any[] }>('/hospital/patients');
        if (res?.patients?.length) {
          setPatients(res.patients);
          setPatientId(res.patients[0].patientId);
        }
      } catch (err) {
        console.warn('Could not load hospital consented patients', err);
      }
    }
    loadPatients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await apiFetch<any>('/hospital/documents', {
        method: 'POST',
        body: JSON.stringify({
          patientId,
          title: `[${docCategory}] ${title}`,
          textContent,
        }),
      });
      setResult(res.message || 'Record successfully registered with verified consent.');
    } catch (err: any) {
      alert(err.message || 'Institutional upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 space-y-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <Link href="/hospital" className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Upload className="w-6 h-6 text-purple-400" />
              Institutional Document Ingestion
            </h1>
            <p className="text-xs text-slate-400">
              Submit EHR/EMR diagnostic notes, discharge summaries, and lab findings to patient timeline
            </p>
          </div>
        </div>

        {result && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{result}</span>
          </div>
        )}

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Target Patient (Active Consented)</label>
                {patients.length > 0 ? (
                  <select
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    {patients.map((p) => (
                      <option key={p.patientId} value={p.patientId}>
                        {p.name} ({p.uniqueId || p.patientId}) - {p.bloodGroup || 'A+'}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    required
                    className="bg-slate-900 border-slate-700 text-white font-mono"
                  />
                )}
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Record Category</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="LAB_REPORT">Laboratory Diagnostic Report</option>
                  <option value="DISCHARGE_SUMMARY">Inpatient Discharge Summary</option>
                  <option value="CONSULTATION_NOTE">Clinical Consultation Note</option>
                  <option value="OPERATIVE_NOTE">Operative / Procedure Report</option>
                  <option value="PRESCRIPTION">Official Hospital Prescription</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Document Title</label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">
                Clinical Content / Report Data
              </label>
              <textarea
                rows={8}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="p-3 bg-purple-950/30 border border-purple-500/20 rounded-xl text-[11px] text-purple-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-purple-400" />
              <span>
                Provenance tag <strong className="font-mono">HOSPITAL_PROVIDED</strong> will be cryptographically signed into the patient's chronological timeline.
              </span>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying Consent & Storing Document...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" /> Ingest Record to Patient Health Journey
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
