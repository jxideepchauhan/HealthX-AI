'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input } from '@healthx/ui';
import { apiFetch } from '@/lib/api';
import { User, HeartPulse, Save, ShieldCheck, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>({
    name: 'Isaac Richard Noronha',
    dob: '2008-08-30',
    sex: 'Male',
    preferredLanguage: 'English',
    location: 'Himachal Pradesh',
    bloodGroup: 'A+',
    heightCm: 180,
    weightKg: 85,
    importantMedicalInformation: 'None reported. User has reported shivering episodes.',
    regularDoctor: 'Dr. Raskik',
    regularHospital: 'Namo Hospital',
    sleepHours: '5-6 hours',
    exerciseHabits: 'Gym/running',
    dailySteps: 7000,
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadProf() {
      try {
        const res = await apiFetch<{ profile: any }>('/profile');
        if (res.profile) setProfile(res.profile);
      } catch (err) {
        console.error(err);
      }
    }
    loadProf();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      await apiFetch('/profile', {
        method: 'PATCH',
        body: JSON.stringify(profile),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="pb-2 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600" />
            <span>Personal Health Profile</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict user-provided records. HealthX AI never automatically infers medical conditions from profile demographics.
          </p>
        </div>

        <Button size="sm" onClick={handleSave} disabled={loading} className="flex items-center gap-1.5 shadow-sm">
          <Save className="w-3.5 h-3.5" />
          <span>{loading ? 'Saving...' : 'Save Profile'}</span>
        </Button>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved and recorded in security audit trail.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* DEMOGRAPHICS */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Demographics & Identification</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <Input
              label="Full Legal Name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              required
            />
            <Input
              label="Date of Birth"
              type="date"
              value={profile.dob}
              onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
              required
            />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Biological Sex
              </label>
              <select
                value={profile.sex}
                onChange={(e) => setProfile({ ...profile, sex: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <Input
              label="Blood Group"
              value={profile.bloodGroup}
              onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
              required
            />
            <Input
              label="Height (cm)"
              type="number"
              value={profile.heightCm}
              onChange={(e) => setProfile({ ...profile, heightCm: parseFloat(e.target.value) })}
            />
            <Input
              label="Weight (kg)"
              type="number"
              value={profile.weightKg}
              onChange={(e) => setProfile({ ...profile, weightKg: parseFloat(e.target.value) })}
            />
            <Input
              label="Geographic Location"
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            />
            <Input
              label="Preferred Language"
              value={profile.preferredLanguage}
              onChange={(e) => setProfile({ ...profile, preferredLanguage: e.target.value })}
            />
          </CardContent>
        </Card>

        {/* CLINICAL METRICS & LIFESTYLE */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">User-Reported Clinical Information & Lifestyle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Regular Physician"
                value={profile.regularDoctor || ''}
                onChange={(e) => setProfile({ ...profile, regularDoctor: e.target.value })}
              />
              <Input
                label="Regular Hospital / Clinic"
                value={profile.regularHospital || ''}
                onChange={(e) => setProfile({ ...profile, regularHospital: e.target.value })}
              />
              <Input
                label="Average Sleep"
                value={profile.sleepHours || ''}
                onChange={(e) => setProfile({ ...profile, sleepHours: e.target.value })}
              />
              <Input
                label="Exercise Habits"
                value={profile.exerciseHabits || ''}
                onChange={(e) => setProfile({ ...profile, exerciseHabits: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Important Clinical Notes / Reported Observations
              </label>
              <textarea
                rows={3}
                value={profile.importantMedicalInformation || ''}
                onChange={(e) => setProfile({ ...profile, importantMedicalInformation: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Note: HealthX AI will treat these notes as user-provided observations and will never invent diagnoses.
              </p>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
