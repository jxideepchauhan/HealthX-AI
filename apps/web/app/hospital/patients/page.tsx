'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input } from '@healthx/ui';
import { apiFetch } from '@/lib/api';
import {
  Users,
  Search,
  ArrowLeft,
  ShieldCheck,
  FileText,
  Calendar,
  Building2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function HospitalPatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadPatients() {
      try {
        const res = await apiFetch<any>('/hospital/patients');
        setPatients(res.patients || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPatients();
  }, []);

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.patientId && p.patientId.toLowerCase().includes(search.toLowerCase())) ||
    (p.uniqueId && p.uniqueId.toLowerCase().includes(search.toLowerCase()))
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
                <Users className="w-6 h-6 text-purple-400" />
                Consented Patients Registry
              </h1>
              <p className="text-xs text-slate-400">
                Patients with active institutional consent grants at Namo Hospital
              </p>
            </div>
          </div>

          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or Unique ID..."
              className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center p-12 text-xs text-slate-500">Loading consented patient records...</div>
        ) : (
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-700 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Patient Name & Unique ID</th>
                  <th className="p-4">Blood Group</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Consent Scope</th>
                  <th className="p-4">Expiry Date</th>
                  <th className="p-4">Consent Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filtered.map((p) => (
                  <tr key={p.patientId} className="hover:bg-slate-700/30 transition">
                    <td className="p-4">
                      <div className="font-bold text-white text-sm">{p.name}</div>
                      <div className="font-mono text-[10px] text-purple-300">{p.uniqueId || p.patientId}</div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-rose-400">{p.bloodGroup || 'A+'}</span>
                    </td>
                    <td className="p-4 text-slate-300">{p.location || 'Himachal Pradesh'}</td>
                    <td className="p-4">
                      <span className="font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        {p.scope || 'ALL'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 font-mono">
                      {new Date(p.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <Badge variant="success" className="text-[10px] bg-emerald-500/20 text-emerald-300">
                        ACTIVE
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/doctor/patients/${p.patientId}`}>
                        <Button size="sm" variant="outline" className="text-[11px] border-slate-600 hover:bg-slate-700 text-white">
                          View Dossier <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
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
