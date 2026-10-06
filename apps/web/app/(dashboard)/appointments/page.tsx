'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input } from '@healthx/ui';
import { apiFetch } from '@/lib/api';
import { Calendar, Plus, Clock, Stethoscope, Building2, Trash2 } from 'lucide-react';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newAppt, setNewAppt] = useState({
    doctorName: 'Dr. Raskik',
    hospitalName: 'Namo Hospital',
    appointmentDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    reason: 'Follow-up consultation for iron deficiency evaluation',
    notes: 'Bring repeat hemoglobin and ferritin test results',
  });

  useEffect(() => {
    loadAppts();
  }, []);

  async function loadAppts() {
    try {
      const res = await apiFetch<{ appointments: any[] }>('/appointments');
      setAppointments(res.appointments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch<{ appointment: any }>('/appointments', {
        method: 'POST',
        body: JSON.stringify(newAppt),
      });
      setAppointments([...appointments, res.appointment]);
      setShowAdd(false);
    } catch (err: any) {
      alert(err.message || 'Failed to schedule appointment');
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this scheduled appointment?')) return;
    try {
      await apiFetch(`/appointments/${id}`, { method: 'DELETE' });
      setAppointments(appointments.filter((a) => a.id !== id));
    } catch (err) {
      alert('Failed to cancel appointment');
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <span>Clinical Appointments & Consultations</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage upcoming hospital visits, follow-up dates, and consultation notes
          </p>
        </div>

        <Button size="sm" onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 shadow-sm">
          <Plus className="w-3.5 h-3.5" />
          <span>Schedule Visit</span>
        </Button>
      </div>

      {showAdd && (
        <Card className="p-5 border-emerald-200 bg-emerald-50/20">
          <form onSubmit={handleCreate} className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Schedule Medical Appointment</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <Input
                label="Doctor Name"
                value={newAppt.doctorName}
                onChange={(e) => setNewAppt({ ...newAppt, doctorName: e.target.value })}
                required
              />
              <Input
                label="Hospital / Clinic"
                value={newAppt.hospitalName}
                onChange={(e) => setNewAppt({ ...newAppt, hospitalName: e.target.value })}
              />
              <Input
                label="Date & Time"
                type="datetime-local"
                value={newAppt.appointmentDate.slice(0, 16)}
                onChange={(e) =>
                  setNewAppt({ ...newAppt, appointmentDate: new Date(e.target.value).toISOString() })
                }
                required
              />
              <Input
                label="Reason for Visit"
                value={newAppt.reason}
                onChange={(e) => setNewAppt({ ...newAppt, reason: e.target.value })}
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowAdd(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Confirm Appointment
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {appointments.map((a) => (
          <Card key={a.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900">{a.doctorName}</h3>
                  <p className="text-xs text-slate-500">{a.hospitalName}</p>
                </div>
                <Badge variant={a.status === 'SCHEDULED' ? 'info' : 'default'}>{a.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 block font-medium">Scheduled Time</span>
                <span className="font-mono text-slate-800 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(a.appointmentDate).toLocaleString()}
                </span>
                <p className="text-slate-600 mt-2 font-medium">Reason: {a.reason}</p>
                {a.notes && <p className="text-slate-500 italic text-[11px] mt-1">Notes: {a.notes}</p>}
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleCancel(a.id)}
                  className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Cancel Visit
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
