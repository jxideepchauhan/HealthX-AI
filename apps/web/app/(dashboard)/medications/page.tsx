'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input } from '@healthx/ui';
import { apiFetch } from '@/lib/api';
import { Pill, Plus, Calendar, User, FileText, CheckCircle2, ShieldCheck, Trash2 } from 'lucide-react';

export default function MedicationsPage() {
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: '',
    prescriber: '',
    instructions: '',
  });

  useEffect(() => {
    loadMeds();
  }, []);

  async function loadMeds() {
    try {
      const res = await apiFetch<{ medications: any[] }>('/medications');
      setMedications(res.medications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleAddMed = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch<{ medication: any }>('/medications', {
        method: 'POST',
        body: JSON.stringify(newMed),
      });
      setMedications([res.medication, ...medications]);
      setShowAddModal(false);
      setNewMed({ name: '', dosage: '', frequency: '', prescriber: '', instructions: '' });
    } catch (err: any) {
      alert(err.message || 'Failed to add medication');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this medication entry?')) return;
    try {
      await apiFetch(`/medications/${id}`, { method: 'DELETE' });
      setMedications(medications.filter((m) => m.id !== id));
    } catch (err) {
      alert('Failed to delete medication');
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Documented Medications
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active and past prescription medications extracted from verified records or user entries
          </p>
        </div>

        <Button size="sm" onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 shadow-sm">
          <Plus className="w-3.5 h-3.5" />
          <span>Add Medication</span>
        </Button>
      </div>

      {showAddModal && (
        <Card className="p-5 border-emerald-200 bg-emerald-50/20">
          <form onSubmit={handleAddMed} className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Record Prescribed Medication</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Medication Name"
                value={newMed.name}
                onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                placeholder="e.g. Iron supplement"
                required
              />
              <Input
                label="Dosage / Strength"
                value={newMed.dosage}
                onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                placeholder="e.g. 1 tablet (Only if prescribed)"
              />
              <Input
                label="Frequency"
                value={newMed.frequency}
                onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                placeholder="e.g. Once daily after food"
              />
              <Input
                label="Prescribing Physician"
                value={newMed.prescriber}
                onChange={(e) => setNewMed({ ...newMed, prescriber: e.target.value })}
                placeholder="e.g. Dr. Raskik"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save Medication Record
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {medications.map((m) => (
          <Card key={m.id} className="hover:shadow-sm transition-all flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900">{m.name}</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {m.dosage ? `Dosage: ${m.dosage}` : 'Dosage: Not documented on prescription'}
                  </p>
                </div>
                <Badge variant={m.isActive ? 'success' : 'default'}>
                  {m.isActive ? 'ACTIVE' : 'COMPLETED'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Prescriber:</span>
                  <span className="font-semibold text-slate-800">{m.prescriber || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Frequency:</span>
                  <span className="text-slate-700">{m.frequency || 'As directed'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Provenance:</span>
                  <Badge variant={m.dataOrigin === 'SYNTHETIC_TEST' ? 'warning' : 'default'} className="text-[9px]">
                    {m.dataOrigin}
                  </Badge>
                </div>
              </div>

              {m.instructions && (
                <p className="text-[11px] text-slate-500 italic bg-amber-50/50 p-2 rounded border border-amber-100">
                  {m.instructions}
                </p>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                {m.sourceDocument ? (
                  <Link
                    href={`/records/${m.sourceDocumentId}`}
                    className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-medium"
                  >
                    <FileText className="w-3 h-3" /> {m.sourceDocument.title}
                  </Link>
                ) : (
                  <span className="text-[11px] text-slate-400">User entered</span>
                )}
                <button
                  onClick={() => handleDelete(m.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                  title="Remove medication"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
