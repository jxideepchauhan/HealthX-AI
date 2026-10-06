'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@healthx/ui';
import { apiFetch } from '@/lib/api';
import * as RechartsModule from 'recharts';

const {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} = RechartsModule as any;
import { ArrowLeft, FlaskConical, Calendar, FileText, Sparkles } from 'lucide-react';

export default function LabDetailPage() {
  const routeParams = useParams();
  const id = (routeParams?.id as string) || '';
  const [lab, setLab] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [labRes, histRes] = await Promise.all([
          apiFetch<{ lab: any }>(`/labs/${id}`),
          apiFetch<{ history: any[] }>(`/labs/${id}/history`),
        ]);
        setLab(labRes.lab);
        setHistory(histRes.history || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-xs text-slate-500">Loading lab trends...</div>;
  if (!lab) return <div className="p-8 text-center text-xs text-slate-500">Lab result not found.</div>;

  const chartData = (history.length > 0 ? history : [lab]).map((h) => ({
    date: h.testDate,
    value: parseFloat(h.value) || 0,
    low: h.referenceLow,
    high: h.referenceHigh,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
        <Link href="/labs" className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">{lab.testName} Trend Analysis</h1>
            <Badge variant={lab.status === 'LOW' ? 'danger' : 'success'}>{lab.status}</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Normalized biomarker trajectory over time compared with documented reference bounds
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CHART (2 Cols) */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span>Biomarker Trajectory ({lab.unit})</span>
              <span className="text-xs text-slate-400 font-normal">Reference: {lab.referenceText || 'Standard'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '11px',
                  }}
                />
                {lab.referenceLow && (
                  <ReferenceLine y={lab.referenceLow} stroke="#f43f5e" strokeDasharray="3 3" label="Low" />
                )}
                {lab.referenceHigh && (
                  <ReferenceLine y={lab.referenceHigh} stroke="#f43f5e" strokeDasharray="3 3" label="High" />
                )}
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#059669"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#059669' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* DETAILS & SOURCE SUMMARY (1 Col) */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Report Origin & Provenance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">Latest Recorded:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {lab.value} {lab.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Document Date:</span>
                <span className="font-mono text-slate-700">{lab.testDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Data Origin:</span>
                <Badge variant={lab.dataOrigin === 'SYNTHETIC_TEST' ? 'warning' : 'default'} className="text-[10px]">
                  {lab.dataOrigin}
                </Badge>
              </div>
            </div>

            {lab.sourceDocument && (
              <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-800">Citing Source Record</span>
                <p className="font-semibold text-slate-900">{lab.sourceDocument.title}</p>
                <Link
                  href={`/records/${lab.sourceDocumentId}`}
                  className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1 mt-2"
                >
                  <FileText className="w-3.5 h-3.5" /> View Original Report
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
