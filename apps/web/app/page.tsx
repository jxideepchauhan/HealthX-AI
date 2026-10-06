'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import {
  FileText,
  Bot,
  HeartPulse,
  FlaskConical,
  Stethoscope,
  ShieldCheck,
  Share2,
  Workflow,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export default function LandingPage() {
  const { t } = useLanguage();

  const features = [
    {
      title: t.featureRecordIntelligence,
      desc: 'Seamless ingestion and OCR extraction across printed and handwritten lab results, prescriptions, and summaries.',
      icon: FileText,
    },
    {
      title: t.featureCopilot,
      desc: 'Strictly grounded clinical explanations with source-document citations. Never hallucinates or invents diagnoses.',
      icon: Bot,
    },
    {
      title: t.featureJourney,
      desc: 'Chronological timeline connecting encounters, observations, lab tests, prescriptions, and symptoms into a single record.',
      icon: HeartPulse,
    },
    {
      title: t.featureLabs,
      desc: 'Automatic reference interval matching, abnormality detection, and longitudinal trend analysis over time.',
      icon: FlaskConical,
    },
    {
      title: t.featureDoctorVisit,
      desc: 'Generates comprehensive, edit-ready doctor visit briefs summarizing recent changes, medicines, and key questions.',
      icon: Stethoscope,
    },
    {
      title: t.featureConsent,
      desc: 'Fine-grained, time-bound consent controls. Instantly revoke access to any doctor or hospital with a single click.',
      icon: ShieldCheck,
    },

    {
      title: 'FHIR-Ready Architecture',
      desc: 'Built upon HL7 FHIR Release 4 compatible schemas for seamless hospital interoperability and data portability.',
      icon: Workflow,
    },
    {
      title: 'ABDM Integration Ready',
      desc: 'Architected to connect with Ayushman Bharat Digital Mission (ABDM) and ABHA ID via secure consent gateways.',
      icon: Share2,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-100">
      {/* HEADER */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              HX
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-lg">HEALTHX AI</span>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector variant="pill" />
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              {t.getStarted}
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="py-20 md:py-28 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Intelligent Personal Health Copilot &bull; FHIR & ABDM Ready</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
          {t.appName}. <br className="hidden sm:inline" />
          <span className="text-emerald-600">{t.tagline}</span>
        </h1>

        <p className="mt-6 text-base md:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          {t.heroSub}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <span>{t.getStarted}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/journey"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all shadow-sm"
          >
            {t.exploreHealthx}
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Zero Hallucinations Policy
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Patient-Owned Consent
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Strict Source Grounding
          </span>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="py-16 bg-white border-y border-slate-200/80 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              Complete Clinical Intelligence Architecture
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Purpose-built healthcare technology adhering strictly to medical safety, privacy-by-design, and patient consent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="p-6 rounded-xl border border-slate-200/70 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-1.5">{feat.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CLINICAL PRINCIPLE DISCLAIMER (Section 2) */}
      <section className="py-14 px-6 max-w-4xl mx-auto text-center">
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 text-left">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2">
            Safety & Clinical Governance Principle
          </h4>
          <p className="text-xs text-amber-800 leading-relaxed">
            HealthX AI is <strong>NOT an autonomous medical decision maker</strong>. It does not independently diagnose,
            prescribe, or change medications. The AI explains and organizes authorized healthcare information backed by strict
            citations. When insufficient evidence exists, it transparently indicates uncertainty.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-8 px-6 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} HealthX AI. "Your Health. Connected. Understood." Built for real clinical interoperability.</p>
      </footer>
    </div>
  );
}
