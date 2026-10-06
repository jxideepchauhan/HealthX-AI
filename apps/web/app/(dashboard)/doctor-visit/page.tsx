'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@healthx/ui';
import { apiFetch } from '@/lib/api';
import {
  Stethoscope,
  Printer,
  Share2,
  FileText,
  Calendar,
  AlertCircle,
  HelpCircle,
  Pill,
  FlaskConical,
  HeartPulse,
} from 'lucide-react';

export default function DoctorVisitPage() {
  const [brief, setBrief] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBrief() {
      try {
        const res = await apiFetch<{ brief: any }>('/doctor-visit/brief', {
          method: 'POST',
        });
        setBrief(res.brief);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBrief();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    alert('Shareable Doctor Brief link generated under active patient consent.');
  };

  if (loading) return <div className="p-8 text-center text-xs text-slate-500">Compiling doctor brief...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="pb-2 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-emerald-600" />
            <span>Doctor Visit Mode & Clinical Brief</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Prepared clinical dossier summarizing recent encounters, biomarker trajectories, and prioritized questions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handlePrint} className="flex items-center gap-1.5">
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </Button>
          <Button size="sm" onClick={handleShare} className="flex items-center gap-1.5 shadow-sm">
            <Share2 className="w-3.5 h-3.5" />
            <span>Share via Consent</span>
          </Button>
        </div>
      </div>

      {brief && (
        <Card className="p-6 md:p-8 space-y-6 print:shadow-none print:border-none">
          {/* DOSSIER HEADER */}
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                CONFIDENTIAL CLINICAL BRIEF
              </span>
              <h2 className="text-lg font-bold text-slate-900">{brief.patientSummary.name}</h2>
              <p className="text-xs text-slate-500">
                Age: {brief.patientSummary.age} &bull; Sex: {brief.patientSummary.sex} &bull; Blood Group: {brief.patientSummary.bloodGroup}
              </p>
            </div>
            <div className="text-right text-xs text-slate-400 font-mono">
              Generated: {new Date(brief.generatedAt).toLocaleDateString()}
            </div>
          </div>

          {/* SECTION 1: DOCUMENTED VITALS & MARKERS */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-emerald-600" />
              <span>Documented Physiological Metrics</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {Object.entries(brief.patientSummary.vitalSummary).map(([k, v]) => (
                <div key={k} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 text-[10px] block font-medium">{k}</span>
                  <span className="text-sm font-semibold text-slate-900 font-mono">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: RECENT LAB BIOMARKER CHANGES */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-amber-600" />
              <span>Documented Lab Values & Abnormality Analysis</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {brief.labChanges.map((lab: any) => (
                <div key={lab.testName} className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900">{lab.testName}</strong>
                    <Badge variant={lab.status === 'LOW' ? 'danger' : 'success'}>{lab.status}</Badge>
                  </div>
                  <div className="flex justify-between font-mono text-slate-600">
                    <span>Recorded: <strong className="text-slate-900">{lab.latestValue}</strong></span>
                    <span className="text-slate-400">Ref: {lab.referenceRange}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: CURRENT RECORDED MEDICATIONS */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-sky-600" />
              <span>Active Prescription Regimen</span>
            </h3>
            <div className="space-y-2 text-xs">
              {brief.recordedMedicines.map((m: any, i: number) => (
                <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-900">{m.name}</span>
                    <span className="text-slate-400 ml-2">Prescriber: {m.prescriber || 'Documented Doctor'}</span>
                  </div>
                  <span className="text-slate-600 italic">
                    {m.dosage ? `Dosage: ${m.dosage}` : 'Dosage not documented on prescription'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: PRIORITIZED QUESTIONS FOR YOUR DOCTOR */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>Suggested Discussion Points for Consultation</span>
            </h3>
            <div className="space-y-2 text-xs">
              {brief.questionsForDoctor.map((q: string, i: number) => (
                <div key={i} className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100 text-slate-800 leading-relaxed flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600/10 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {i + 1}
                  </span>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
