'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input } from '@healthx/ui';
import { apiFetch } from '@/lib/api';
import { Share2, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, Key, ExternalLink } from 'lucide-react';

export default function HealthConnectionsPage() {
  const [status, setStatus] = useState<string>('NOT_CONNECTED');
  const [abhaAddress, setAbhaAddress] = useState('isaac.noronha@abdm');
  const [isOfficialConfigured, setIsOfficialConfigured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadStatus();
  }, []);

  async function loadStatus() {
    try {
      const res = await apiFetch<{
        status: string;
        abhaAddress: string | null;
        isOfficialGatewayConfigured: boolean;
      }>('/abdm/status');
      setStatus(res.status);
      if (res.abhaAddress) setAbhaAddress(res.abhaAddress);
      setIsOfficialConfigured(res.isOfficialGatewayConfigured);
    } catch (err) {
      console.error(err);
    }
  }

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await apiFetch<{ message: string; status: string }>('/abdm/connect', {
        method: 'POST',
        body: JSON.stringify({ abhaAddress }),
      });
      setStatus(res.status);
      setMessage(res.message);
    } catch (err: any) {
      alert(err.message || 'Failed to initiate ABDM connection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="pb-2 border-b border-slate-200/80">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Share2 className="w-5 h-5 text-emerald-600" />
          <span>Health Connections & Ayushman Bharat (ABDM)</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Interoperability gateway connecting your HealthX profile with India's Ayushman Bharat Digital Mission (ABDM)
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">ABHA (Ayushman Bharat Health Account) Status</CardTitle>
            <Badge
              variant={
                status === 'CONNECTED' ? 'success' : status === 'PENDING' ? 'warning' : 'default'
              }
            >
              {status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-[10px] block font-medium">Gateway Integration Mode</span>
              <span className="font-semibold text-slate-800">
                {isOfficialConfigured ? 'Official ABDM Gateway (Configured)' : 'Local / Sandbox ABDM Connector'}
              </span>
            </div>
            <Badge variant="info" className="text-[10px]">
              {isOfficialConfigured ? 'PRODUCTION READY' : 'DEVELOPMENT MOCK'}
            </Badge>
          </div>

          {message && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleConnect} className="space-y-3 pt-2">
            <Input
              label="ABHA Address"
              value={abhaAddress}
              onChange={(e) => setAbhaAddress(e.target.value)}
              placeholder="e.g. username@abdm or username@sbx"
              required
            />

            <Button type="submit" size="sm" disabled={loading} className="w-full sm:w-auto">
              {status === 'CONNECTED' ? 'Reconnect ABHA' : 'Connect ABHA'}
            </Button>
          </form>

          {/* FLOW ARCHITECTURE EXPLANATION (Section 47) */}
          <div className="mt-6 pt-4 border-t border-slate-200/80 space-y-2">
            <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
              ABHA Interoperability & Data Flow Architecture
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px]">
              <div className="p-2 bg-slate-50 rounded border border-slate-200">1. ABHA Identity</div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">2. Consent Gateway</div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">3. FHIR R4 Bundle</div>
              <div className="p-2 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 font-semibold">
                4. HealthX Grounding
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
