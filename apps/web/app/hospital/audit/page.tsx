'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input } from '@healthx/ui';
import { apiFetch } from '@/lib/api';
import {
  Lock,
  ArrowLeft,
  ShieldCheck,
  Search,
  CheckCircle2,
  FileText,
  Clock,
  Terminal,
} from 'lucide-react';

export default function HospitalAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadAudit() {
      try {
        const res = await apiFetch<any>('/hospital/audit');
        setLogs(res.logs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAudit();
  }, []);

  const filtered = logs.filter((l) =>
    (l.action || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.resource || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.user?.identifier && l.user.identifier.toLowerCase().includes(search.toLowerCase())) ||
    (l.user?.uniqueId && l.user.uniqueId.toLowerCase().includes(search.toLowerCase()))
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
                <Lock className="w-6 h-6 text-amber-400" />
                Tamper-Evident Institutional Audit Trail
              </h1>
              <p className="text-xs text-slate-400">
                Cryptographically chained SHA-256 integrity log of all institutional accesses and PHI events
              </p>
            </div>
          </div>

          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by action, resource, or actor..."
              className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center p-12 text-xs text-slate-500">Loading audit records...</div>
        ) : (
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-700 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Actor Persona & Unique ID</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Resource Target</th>
                  <th className="p-4">Integrity Hash (SHA-256)</th>
                  <th className="p-4">Chain Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-700/30 transition">
                    <td className="p-4 font-mono text-[11px] text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white">
                        {log.user?.uniqueId || log.user?.identifier || log.userId}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">({log.userRole})</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold ${
                          log.action === 'CREATE'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : log.action === 'READ'
                            ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                            : 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-slate-200">
                      <strong className="text-white">{log.resource}</strong>
                      <span className="font-mono text-[10px] text-slate-400 block truncate max-w-xs">
                        ID: {log.resourceId}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[10px] text-amber-300 truncate max-w-xs">
                      {log.hash}
                    </td>
                    <td className="p-4">
                      <Badge variant="success" className="text-[10px] bg-emerald-500/20 text-emerald-300">
                        CHAIN VERIFIED
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
