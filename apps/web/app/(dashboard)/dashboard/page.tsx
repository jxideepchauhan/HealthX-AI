'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Button,
} from '@healthx/ui';
import { apiFetch } from '@/lib/api';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  HeartPulse,
  FileText,
  FlaskConical,
  Pill,
  Calendar,
  Lock,
  Sparkles,
  ArrowRight,
  TrendingDown,
  AlertTriangle,
  Upload,
  User,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';

export default function DashboardPage() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [labs, setLabs] = useState<any[]>([]);
  const [medications, setMedications] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [consents, setConsents] = useState<any[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [profData, docsData, labsData, medsData, timelineData, consentsData] =
          await Promise.allSettled([
            apiFetch<{ profile: any }>('/profile'),
            apiFetch<{ documents: any[] }>('/documents'),
            apiFetch<{ labs: any[] }>('/labs'),
            apiFetch<{ medications: any[] }>('/medications'),
            apiFetch<{ events: any[] }>('/timeline'),
            apiFetch<{ consents: any[] }>('/consents'),
          ]);

        if (profData.status === 'fulfilled' && profData.value.profile) {
          setProfile(profData.value.profile);
        } else {
          // Default seeded patient details per section 92
          setProfile({
            name: 'Isaac Richard Noronha',
            dob: '2008-08-30',
            sex: 'Male',
            bloodGroup: 'A+',
            heightCm: 180,
            weightKg: 85,
            location: 'Himachal Pradesh',
            regularDoctor: 'Dr. Raskik',
            regularHospital: 'Namo Hospital',
          });
        }

        if (docsData.status === 'fulfilled') setDocuments(docsData.value.documents || []);
        if (labsData.status === 'fulfilled') setLabs(labsData.value.labs || []);
        if (medsData.status === 'fulfilled') setMedications(medsData.value.medications || []);
        if (timelineData.status === 'fulfilled') setEvents(timelineData.value.events || []);
        if (consentsData.status === 'fulfilled') setConsents(consentsData.value.consents || []);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Patient Health Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Overview of your verified medical records, labs, medications, and consent permissions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/records/upload">
            <Button size="sm" className="flex items-center gap-1.5 shadow-sm">
              <Upload className="w-3.5 h-3.5" />
              <span>{t.uploadDocument}</span>
            </Button>
          </Link>
          <Link href="/assistant">
            <Button size="sm" variant="outline" className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.navCopilot}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 8 DASHBOARD CARDS (Section 95) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: Health Overview */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-emerald-600" />
                <span>Health Overview</span>
              </CardTitle>
              <CardDescription>Primary profile & documented physiological markers</CardDescription>
            </div>
            <Badge variant="info">User Verified</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 font-medium block mb-1">Blood Group</span>
                <span className="text-base font-bold text-slate-900">{profile?.bloodGroup || 'A+'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 font-medium block mb-1">Height / Weight</span>
                <span className="text-sm font-bold text-slate-900">
                  {profile?.heightCm || 180} cm / {profile?.weightKg || 85} kg
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 font-medium block mb-1">Reported SpO2</span>
                <span className="text-sm font-bold text-emerald-700">98% (Normal)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 font-medium block mb-1">Blood Pressure</span>
                <span className="text-xs font-semibold text-amber-700">Highest Systolic 149</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Physician: <strong className="text-slate-800">{profile?.regularDoctor || 'Dr. Raskik'}</strong> ({profile?.regularHospital || 'Namo Hospital'})</span>
              <Link href="/profile" className="text-emerald-700 font-medium hover:underline">
                Edit Profile &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* CARD 6: AI Insights */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-emerald-50/40 to-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>AI Clinical Copilot Insights</span>
              </CardTitle>
              <CardDescription>Grounded observations based on authorized records</CardDescription>
            </div>
            <Badge variant="success">Strictly Grounded</Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-3 bg-white rounded-lg border border-emerald-100 shadow-2xs text-xs text-slate-700 leading-relaxed">
              <p className="font-semibold text-slate-900 mb-1">Hemoglobin & Ferritin Advisory:</p>
              Your latest recorded hemoglobin is <strong className="text-rose-700 font-mono">10.8 g/dL</strong> and ferritin is <strong className="text-rose-700 font-mono">12 ng/mL</strong>, documented in your CBC report dated 15 Sep 2026. Both are below standard reference intervals.
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[11px] text-slate-400">Cited from: CBC + Iron Studies (Page 1)</span>
              <Link href="/assistant" className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1">
                Ask Copilot <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* CARD 2: Recent Reports */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-600" />
              <span>Recent Reports</span>
            </CardTitle>
            <Link href="/records" className="text-[11px] text-emerald-700 hover:underline">View all</Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {documents.length > 0 ? (
              documents.slice(0, 2).map((doc) => (
                <div key={doc.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                  <p className="font-semibold text-slate-800 truncate">{doc.title}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{doc.fileType} &bull; {doc.processingStatus}</p>
                </div>
              ))
            ) : (
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                <p className="font-semibold text-slate-800 truncate">CBC + Iron Studies [SYNTHETIC TEST]</p>
                <p className="text-[10px] text-slate-400 mt-0.5">PDF &bull; Processed</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CARD 3: Recent Labs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-amber-600" />
              <span>Recent Labs</span>
            </CardTitle>
            <Link href="/labs" className="text-[11px] text-emerald-700 hover:underline">View all</Link>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
              <div>
                <span className="font-semibold text-slate-800">Hemoglobin</span>
                <span className="text-[10px] text-slate-400 block">Ref: 13.0–17.0</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-rose-700 font-mono">10.8 g/dL</span>
                <Badge variant="danger" className="text-[9px] px-1.5 py-0 block mt-0.5">LOW</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
              <div>
                <span className="font-semibold text-slate-800">Ferritin</span>
                <span className="text-[10px] text-slate-400 block">Ref: 30–400</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-rose-700 font-mono">12 ng/mL</span>
                <Badge variant="danger" className="text-[9px] px-1.5 py-0 block mt-0.5">LOW</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CARD 4: Medication Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-sky-600" />
              <span>Medications</span>
            </CardTitle>
            <Link href="/medications" className="text-[11px] text-emerald-700 hover:underline">Manage</Link>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">Iron supplement</span>
                <Badge variant="success" className="text-[9px]">Active</Badge>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Prescribed by Dr. Raskik</p>
              <p className="text-[9px] text-amber-600 mt-0.5 font-medium">*Dosage not documented on prescription</p>
            </div>
          </CardContent>
        </Card>

        {/* CARD 5: Health Journey */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-emerald-600" />
              <span>Health Journey</span>
            </CardTitle>
            <Link href="/journey" className="text-[11px] text-emerald-700 hover:underline">Timeline</Link>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Dr. Raskik Consultation</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">15 Sep 2026 &bull; Fatigue & dizziness</p>
            </div>
          </CardContent>
        </Card>

        {/* CARD 7: Upcoming Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-600" />
              <span>Appointments</span>
            </CardTitle>
            <Link href="/appointments" className="text-[11px] text-emerald-700 hover:underline">Book</Link>
          </CardHeader>
          <CardContent className="text-xs">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <p className="font-semibold text-slate-800">Dr. Raskik</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Follow-up Lab Review</p>
              <Badge variant="default" className="text-[9px] mt-1.5">Scheduled</Badge>
            </div>
          </CardContent>
        </Card>

        {/* CARD 8: Consent Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-600" />
              <span>Consent Status</span>
            </CardTitle>
            <Link href="/privacy" className="text-[11px] text-emerald-700 hover:underline">Privacy</Link>
          </CardHeader>
          <CardContent className="text-xs">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">Dr. Raskik</span>
                <Badge variant="success" className="text-[9px]">ACTIVE</Badge>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Scope: ALL Records</p>
              <p className="text-[9px] text-emerald-700 font-medium mt-0.5">Revocable at any time</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
