'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@healthx/ui';
import { apiFetch } from '@/lib/api';
import { ShieldCheck, Calendar, Lock, Hash } from 'lucide-react';

export default function AuditPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAudit() {
      try {
        const res = await apiFetch<{ auditEvents: any[] }>('/audit');
        setEvents(res.auditEvents || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAudit();
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200/80">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Security & Access Audit Trail</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Tamper-evident, cryptographically chained logs tracking every read, update, share, and consent action
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">Actor Role</th>
                  <th className="py-3 px-4">Result</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Hash Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-800">{ev.action}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{ev.resource}</td>
                    <td className="py-3 px-4">
                      <Badge variant="default" className="text-[10px]">{ev.userRole}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={ev.result === 'SUCCESS' ? 'success' : 'danger'} className="text-[10px]">
                        {ev.result}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      {new Date(ev.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-[10px] text-slate-400">
                      <span className="truncate block max-w-[120px]" title={ev.hash}>
                        {ev.hash?.slice(0, 16)}...
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
