'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@healthx/ui';
import { apiFetch } from '@/lib/api';
import { ShieldAlert, QrCode, Phone, HeartPulse, AlertTriangle, Eye, EyeOff } from 'lucide-react';

export default function EmergencyPage() {
  const [profile, setProfile] = useState<any>({
    name: 'Isaac Richard Noronha',
    bloodGroup: 'A+',
    allergies: ['Unknown'],
    importantInfo: 'None reported. User-reported shivering episodes.',
    emergencyContact: { name: 'Father', phone: '+91-9876543210', relation: 'Father' },
  });

  const [visibleFields, setVisibleFields] = useState({
    name: true,
    bloodGroup: true,
    allergies: true,
    importantInfo: true,
    emergencyContact: true,
  });

  const toggleField = (key: keyof typeof visibleFields) => {
    setVisibleFields({ ...visibleFields, [key]: !visibleFields[key] });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="pb-2 border-b border-slate-200/80">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <span>User-Controlled Emergency Profile</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Select minimal critical information to expose for paramedics and first responders via secure emergency QR code
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* EMERGENCY CARD PREVIEW */}
        <Card className="border-rose-200 bg-rose-50/20">
          <CardHeader className="bg-rose-600 text-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider">FIRST RESPONDER PROFILE</span>
              <Badge variant="default" className="bg-white/20 text-white text-[10px] border-0">EMERGENCY ONLY</Badge>
            </div>
            <h2 className="text-lg font-extrabold mt-1">
              {visibleFields.name ? profile.name : '[NAME HIDDEN]'}
            </h2>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs">
            {visibleFields.bloodGroup && (
              <div className="p-3 bg-white rounded-lg border border-rose-100 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Blood Group</span>
                <span className="text-base font-bold text-rose-600 font-mono">{profile.bloodGroup}</span>
              </div>
            )}

            {visibleFields.allergies && (
              <div className="p-3 bg-white rounded-lg border border-rose-100">
                <span className="text-slate-500 font-medium block mb-1">Documented Allergies</span>
                <span className="font-semibold text-slate-900">{profile.allergies.join(', ')}</span>
              </div>
            )}

            {visibleFields.importantInfo && (
              <div className="p-3 bg-white rounded-lg border border-rose-100">
                <span className="text-slate-500 font-medium block mb-1">Critical Information</span>
                <span className="text-slate-700">{profile.importantInfo}</span>
              </div>
            )}

            {visibleFields.emergencyContact && (
              <div className="p-3 bg-white rounded-lg border border-rose-100 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 font-medium block">Emergency Contact</span>
                  <span className="font-bold text-slate-900">
                    {profile.emergencyContact.name} ({profile.emergencyContact.relation})
                  </span>
                </div>
                <a
                  href={`tel:${profile.emergencyContact.phone}`}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-md font-semibold text-xs flex items-center gap-1 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" /> Call
                </a>
              </div>
            )}

            <div className="pt-2 text-center text-[10px] text-slate-400">
              HealthX AI Privacy Notice: Full medical records are completely excluded from emergency broadcast.
            </div>
          </CardContent>
        </Card>

        {/* QR CODE & VISIBILITY CONTROLS */}
        <div className="space-y-4">
          <Card className="text-center p-6 space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Emergency Quick-Response (QR) Code</h3>
            <p className="text-xs text-slate-500">
              Scan from any mobile device to display the emergency profile configured on the left.
            </p>

            <div className="w-44 h-44 mx-auto bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-4">
              <QrCode className="w-28 h-28 text-slate-800" />
              <span className="text-[10px] text-slate-400 mt-2 font-mono">HX-EMERGENCY-2026</span>
            </div>
          </Card>

          <Card className="p-4 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 mb-2">Privacy & Disclosure Controls</h4>
            {Object.keys(visibleFields).map((key) => {
              const k = key as keyof typeof visibleFields;
              const isVis = visibleFields[k];
              return (
                <div key={k} className="flex items-center justify-between p-2 rounded hover:bg-slate-50">
                  <span className="capitalize text-slate-700 font-medium">{k.replace(/([A-Z])/g, ' $1')}</span>
                  <button
                    onClick={() => toggleField(k)}
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-900"
                  >
                    {isVis ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                    <span className="text-[11px]">{isVis ? 'Visible' : 'Hidden'}</span>
                  </button>
                </div>
              );
            })}
          </Card>
        </div>
      </div>
    </div>
  );
}
