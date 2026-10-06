'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input } from '@healthx/ui';
import { apiFetch, ensureSession } from '@/lib/api';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Calendar, Plus, Clock, Stethoscope, Building2, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function AppointmentsPage() {
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newAppt, setNewAppt] = useState({
    doctorName: 'Dr. Raskik',
    hospitalName: 'Namo Hospital',
    appointmentDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    reason: 'Follow-up consultation for iron deficiency evaluation',
    notes: 'Bring repeat hemoglobin and ferritin test results',
  });

  useEffect(() => {
    // Ensure active session on page mount
    ensureSession('PATIENT').then(() => {
      loadAppts();
    });
  }, []);

  async function loadAppts() {
    try {
      const res = await apiFetch<{ appointments: any[] }>('/appointments');
      setAppointments(res.appointments || []);
    } catch (err: any) {
      console.warn('Could not load appointments initially:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await apiFetch<{ appointment: any }>('/appointments', {
        method: 'POST',
        body: JSON.stringify(newAppt),
      });

      if (res.appointment) {
        setAppointments((prev) => [...prev, res.appointment]);
      } else {
        await loadAppts();
      }

      setFeedback({
        type: 'success',
        message: `Appointment successfully scheduled with ${newAppt.doctorName} at ${newAppt.hospitalName}!`,
      });
      setShowAdd(false);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to schedule appointment. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this scheduled appointment?')) return;
    try {
      await apiFetch(`/appointments/${id}`, { method: 'DELETE' });
      setAppointments(appointments.filter((a) => a.id !== id));
      setFeedback({
        type: 'success',
        message: 'Appointment cancelled successfully.',
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to cancel appointment',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <span>{t.apptsTitle}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.apptsSubtitle}
          </p>
        </div>

        <Button size="sm" onClick={() => { setShowAdd(true); setFeedback(null); }} className="flex items-center gap-1.5 shadow-sm">
          <Plus className="w-3.5 h-3.5" />
          <span>{t.scheduleVisit}</span>
        </Button>
      </div>

      {/* Inline Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span className="font-medium flex-1">{feedback.message}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-600 text-xs px-1"
          >
            ✕
          </button>
        </div>
      )}

      {showAdd && (
        <Card className="p-5 border-emerald-200 bg-emerald-50/20 shadow-sm">
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-600" />
                {t.scheduleApptTitle}
              </h3>
              <Badge variant="success">{t.confirmedSlot}</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <Input
                label={t.doctorName}
                value={newAppt.doctorName}
                onChange={(e) => setNewAppt({ ...newAppt, doctorName: e.target.value })}
                required
              />
              <Input
                label={t.hospitalClinic}
                value={newAppt.hospitalName}
                onChange={(e) => setNewAppt({ ...newAppt, hospitalName: e.target.value })}
              />
              <Input
                label={t.dateTime}
                type="datetime-local"
                value={newAppt.appointmentDate.slice(0, 16)}
                onChange={(e) =>
                  setNewAppt({ ...newAppt, appointmentDate: new Date(e.target.value).toISOString() })
                }
                required
              />
              <Input
                label={t.reasonForVisit}
                value={newAppt.reason}
                onChange={(e) => setNewAppt({ ...newAppt, reason: e.target.value })}
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-emerald-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAdd(false)}
                disabled={submitting}
              >
                {t.cancel}
              </Button>
              <Button type="submit" size="sm" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    {t.loading}
                  </>
                ) : (
                  t.confirmAppointment
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          <span>{t.loading}</span>
        </div>
      ) : appointments.length === 0 ? (
        <Card className="p-8 text-center bg-slate-50 border-dashed border-slate-200">
          <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="font-semibold text-slate-700 text-sm">{t.noVisitsTitle}</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {t.noVisitsDesc}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map((a) => (
            <Card key={a.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                      {a.doctorName}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      {a.hospitalName}
                    </p>
                  </div>
                  <Badge variant={a.status === 'SCHEDULED' ? 'info' : 'default'}>{a.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-medium">{t.scheduledTime}</span>
                  <span className="font-mono text-slate-800 font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(a.appointmentDate).toLocaleString()}
                  </span>
                  <p className="text-slate-600 mt-2 font-medium">{t.reasonForVisit}: {a.reason}</p>
                  {a.notes && <p className="text-slate-500 italic text-[11px] mt-1">{a.notes}</p>}
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleCancel(a.id)}
                    className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> {t.cancelVisit}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

