'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@healthx/ui';
import { apiFetch } from '@/lib/api';
import { FlaskConical, TrendingUp, TrendingDown, Calendar, ArrowRight, FileText } from 'lucide-react';

export default function LabsPage() {
  const [labs, setLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLabs() {
      try {
        const res = await apiFetch<{ labs: any[] }>('/labs');
        setLabs(res.labs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadLabs();
  }, []);

  const getStatusBadge = (status: string) => {
    if (status === 'LOW') return <Badge variant="danger">LOW</Badge>;
    if (status === 'HIGH') return <Badge variant="danger">HIGH</Badge>;
    if (status === 'NORMAL') return <Badge variant="success">NORMAL</Badge>;
    return <Badge variant="default">UNKNOWN</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Laboratory Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Normalized lab test results evaluated against documented laboratory reference intervals
          </p>
        </div>

        <Link href="/records/upload">
          <Button size="sm">Upload Lab Report</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {labs.map((item) => (
          <Card key={item.id} className="hover:shadow-sm transition-all flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900">{item.testName}</h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {item.normalizedName || item.testName}
                  </p>
                </div>
                {getStatusBadge(item.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-baseline justify-between">
                <div>
                  <span className="text-slate-400 text-[10px] block">Documented Value</span>
                  <span className="text-lg font-bold text-slate-900 font-mono">
                    {item.value} <span className="text-xs font-normal text-slate-500">{item.unit}</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block">Reference Range</span>
                  <span className="text-xs font-mono font-medium text-slate-700">
                    {item.referenceText || (item.referenceLow !== null ? `${item.referenceLow} - ${item.referenceHigh} ${item.unit}` : 'Not documented')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> {item.testDate}
                </span>
                {item.dataOrigin === 'SYNTHETIC_TEST' && (
                  <Badge variant="warning" className="text-[9px]">SYNTHETIC DATA</Badge>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/labs/${item.id}`}
                  className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  Historical Trends &rarr;
                </Link>
                {item.sourceDocumentId && (
                  <Link
                    href={`/records/${item.sourceDocumentId}`}
                    className="text-[11px] text-slate-400 hover:text-slate-700 flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3" /> View Source
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
