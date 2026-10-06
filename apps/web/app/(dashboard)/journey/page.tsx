'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, Badge, Button } from '@healthx/ui';
import { apiFetch } from '@/lib/api';
import {
  HeartPulse,
  Stethoscope,
  FlaskConical,
  Pill,
  FileText,
  Calendar,
  Filter,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function JourneyPage() {
  const [filter, setFilter] = useState('ALL');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTimeline() {
      try {
        const query = filter === 'ALL' ? '' : `?type=${filter}`;
        const res = await apiFetch<{ events: any[] }>(`/timeline${query}`);
        setEvents(res.events || []);
      } catch (err) {
        console.error('Failed to load timeline:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTimeline();
  }, [filter]);

  const categories = [
    { label: 'All', value: 'ALL' },
    { label: 'Consultations', value: 'CONSULTATION', icon: Stethoscope },
    { label: 'Labs', value: 'LAB', icon: FlaskConical },
    { label: 'Prescriptions', value: 'PRESCRIPTION', icon: Pill },
    { label: 'Documents', value: 'DOCUMENT_UPLOAD', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Unified Health Journey
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Chronological graph of all medical encounters, diagnostic tests, and documented prescriptions
          </p>
        </div>

        {/* Category Filters (Section 98) */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setFilter(c.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === c.value
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* TIMELINE LIST */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-emerald-100 space-y-6 my-6">
        {events.length > 0 ? (
          events.map((item, idx) => (
            <div key={item.id || idx} className="relative group">
              {/* Timeline Marker Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 border-emerald-500 bg-white group-hover:bg-emerald-500 transition-colors"></div>

              <Card className="hover:shadow-sm transition-all">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900">{item.title}</span>
                      <Badge variant="default" className="text-[10px] font-mono">
                        {item.eventType}
                      </Badge>
                      {item.dataOrigin === 'SYNTHETIC_TEST' && (
                        <Badge variant="warning" className="text-[10px]">SYNTHETIC TEST DATA</Badge>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {item.eventDate}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.description}</p>

                  {item.sourceDocument && (
                    <div className="mt-3 pt-2 flex items-center justify-between text-xs text-slate-500">
                      <span>Source: <strong className="text-slate-700">{item.sourceDocument.title}</strong></span>
                      <Link
                        href={`/records/${item.sourceDocument.id}`}
                        className="text-emerald-700 font-medium hover:underline flex items-center gap-1"
                      >
                        View Source Document <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))
        ) : (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500">No timeline events found for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
