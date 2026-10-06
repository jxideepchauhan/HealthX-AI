'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input } from '@healthx/ui';
import { apiFetch } from '@/lib/api';
import { Lock, ShieldCheck, UserX, Plus, Calendar, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyPage() {
  const [consents, setConsents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [newConsent, setNewConsent] = useState({
    recipientId: 'user-doctor-raskik',
    recipientName: 'Dr. Raskik',
    recipientRole: 'DOCTOR',
    organizationName: 'Namo Hospital',
    scope: 'ALL',
    expiryDate: '2027-10-06T00:00:00.000Z',
    purpose: 'Ongoing outpatient clinical monitoring',
  });

  useEffect(() => {
    loadConsents();
  }, []);

  async function loadConsents() {
    try {
      const res = await apiFetch<{ consents: any[] }>('/consents');
      setConsents(res.consents || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleRevoke = async (id: string) => {
    if (!confirm('Are you sure you want to revoke access? This will immediately terminate all access rights.')) return;
    try {
      await apiFetch(`/consents/${id}`, { method: 'DELETE' });
      setConsents(
        consents.map((c) => (c.id === id ? { ...c, status: 'REVOKED' } : c))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to revoke consent');
    }
  };

  const handleGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch<{ consent: any }>('/consents', {
        method: 'POST',
        body: JSON.stringify(newConsent),
      });
      setConsents([res.consent, ...consents]);
      setShowGrantModal(false);
    } catch (err: any) {
      alert(err.message || 'Failed to grant consent');
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" />
            <span>Privacy & Consent Center</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict consent-based authorization engine. You retain absolute control over who views your clinical data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/audit">
            <Button size="sm" variant="outline" className="text-xs">
              View Audit Trail
            </Button>
          </Link>
          <Button size="sm" onClick={() => setShowGrantModal(true)} className="flex items-center gap-1.5 shadow-sm">
            <Plus className="w-3.5 h-3.5" />
            <span>Grant Consent</span>
          </Button>
        </div>
      </div>

      {showGrantModal && (
        <Card className="p-5 border-emerald-200 bg-emerald-50/20">
          <form onSubmit={handleGrant} className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Grant Authorized Healthcare Access</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <Input
                label="Provider Name"
                value={newConsent.recipientName}
                onChange={(e) => setNewConsent({ ...newConsent, recipientName: e.target.value })}
                required
              />
              <Input
                label="Healthcare Organization"
                value={newConsent.organizationName}
                onChange={(e) => setNewConsent({ ...newConsent, organizationName: e.target.value })}
              />
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Access Scope
                </label>
                <select
                  value={newConsent.scope}
                  onChange={(e) => setNewConsent({ ...newConsent, scope: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                >
                  <option value="ALL">ALL (Full Record)</option>
                  <option value="LABS">LABS Only</option>
                  <option value="PRESCRIPTIONS">PRESCRIPTIONS Only</option>
                  <option value="CONSULTATIONS">CONSULTATIONS Only</option>
                  <option value="MEDICATIONS">MEDICATIONS Only</option>
                </select>
              </div>
              <Input
                label="Clinical Purpose"
                value={newConsent.purpose}
                onChange={(e) => setNewConsent({ ...newConsent, purpose: e.target.value })}
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowGrantModal(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Confirm & Issue Consent
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* CONSENT LIST */}
      <div className="space-y-4">
        {consents.map((c) => (
          <Card key={c.id}>
            <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{c.recipientName}</span>
                  <Badge variant={c.status === 'ACTIVE' ? 'success' : 'danger'}>
                    {c.status}
                  </Badge>
                  <Badge variant="default" className="font-mono text-[10px]">
                    SCOPE: {c.scope}
                  </Badge>
                </div>
                <p className="text-slate-500">
                  Institution: <strong className="text-slate-700">{c.organizationName || 'Individual Practice'}</strong> &bull; Purpose: {c.purpose}
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  Valid from {new Date(c.startDate).toLocaleDateString()} until {new Date(c.expiryDate).toLocaleDateString()}
                </p>
              </div>

              {c.status === 'ACTIVE' && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleRevoke(c.id)}
                  className="shrink-0 flex items-center gap-1 text-xs"
                >
                  <UserX className="w-3.5 h-3.5" />
                  <span>Revoke Access</span>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
