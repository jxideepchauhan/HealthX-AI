'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input } from '@healthx/ui';
import { apiFetch } from '@/lib/api';
import {
  ShieldCheck,
  ArrowLeft,
  Search,
  Calendar,
  Lock,
  Building2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function HospitalConsentsPage() {
  const [consents, setConsents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadConsents() {
      try {
        const res = await apiFetch<any>('/hospital/consents');
        setConsents(res.consents || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadConsents();
  }, []);

  const filtered = consents.filter((c) =>
    (c.patientName || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.recipientName && c.recipientName.toLowerCase().includes(search.toLowerCase())) ||
    (c.purpose && c.purpose.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Link href="/hospital" className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                Institutional Consent Governance Console
              </h1>
              <p className="text-xs text-slate-400">
                Audit and monitor active, expired, and revoked patient consents across all departments
              </p>
            </div>
          </div>

          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient, doctor, or purpose..."
              className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center p-12 text-xs text-slate-500">Loading consent records...</div>
        ) : (
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-700 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Patient Name & Unique ID</th>
                  <th className="p-4">Authorized Recipient</th>
                  <th className="p-4">Scope</th>
                  <th className="p-4">Clinical Purpose</th>
                  <th className="p-4">Valid Period</th>
                  <th className="p-4">Consent Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-700/30 transition">
                    <td className="p-4">
                      <div className="font-bold text-white text-sm">{c.patientName}</div>
                      <div className="font-mono text-[10px] text-purple-300">{c.patientUniqueId || c.patientId}</div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-200">{c.recipientName || 'Namo Hospital Staff'}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">({c.recipientRole})</span>
                    </td>
                    <td className="p-4">
                      <span className="font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        {c.scope}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 max-w-xs">{c.purpose}</td>
                    <td className="p-4 text-slate-400 font-mono text-[11px]">
                      {new Date(c.startDate).toLocaleDateString()} &rarr; {new Date(c.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <Badge variant="success" className="text-[10px] bg-emerald-500/20 text-emerald-300">
                        {c.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
