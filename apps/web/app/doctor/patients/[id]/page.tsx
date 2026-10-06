'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@healthx/ui';
import { apiFetch } from '@/lib/api';
import {
  ArrowLeft,
  Stethoscope,
  HeartPulse,
  FlaskConical,
  Pill,
  FileText,
  Calendar,
  ShieldCheck,
} from 'lucide-react';

export default function DoctorPatientDetailPage() {
  const routeParams = useParams();
  const id = (routeParams?.id as string) || '';
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await apiFetch<{ patient: any }>(`/doctor/patients/${id}`);
        setPatient(res.patient);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <div className="p-10 text-center text-xs text-slate-500">Checking consent & loading patient records...</div>;
  if (!patient) return <div className="p-10 text-center text-xs text-slate-500">Access denied or patient not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 space-y-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
          <Link href="/doctor" className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">{patient.profile?.name || patient.identifier}</h1>
              <Badge variant="success">CONSENT VERIFIED</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              DOB: {patient.profile?.dob || 'N/A'} &bull; Blood: {patient.profile?.bloodGroup || 'N/A'} &bull; Location: {patient.profile?.location || 'N/A'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LABS (Col 1) */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-amber-600" />
                <span>Authorized Lab Reports</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {patient.labResults?.map((l: any) => (
                <div key={l.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex justify-between">
                  <div>
                    <strong className="text-slate-800">{l.testName}</strong>
                    <span className="text-[10px] text-slate-400 block">{l.testDate}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-rose-700 font-mono">{l.value} {l.unit}</span>
                    <Badge variant={l.status === 'LOW' ? 'danger' : 'success'} className="text-[9px] block mt-0.5">
                      {l.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* MEDICATIONS (Col 2) */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Pill className="w-4 h-4 text-sky-600" />
                <span>Medication History</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {patient.medications?.map((m: any) => (
                <div key={m.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex justify-between font-semibold text-slate-900">
                    <span>{m.name}</span>
                    <Badge variant="success" className="text-[9px]">Active</Badge>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Prescriber: {m.prescriber || 'Dr. Raskik'}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* TIMELINE (Col 3) */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-emerald-600" />
                <span>Recent Timeline Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {patient.timelineEvents?.slice(0, 4).map((e: any) => (
                <div key={e.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-semibold text-slate-800 block">{e.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{e.eventDate} &bull; {e.eventType}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
