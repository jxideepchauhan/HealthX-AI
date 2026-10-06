'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@healthx/ui';
import { Building2, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';

export default function HospitalsPage() {
  const hospitals = [
    {
      id: 'hosp-001',
      name: 'Namo Hospital',
      address: 'Himachal Pradesh, India',
      phone: '+91-177-2800000',
      email: 'care@namohospital.org',
      type: 'Multi-Specialty Healthcare Institute',
      status: 'Active Consent',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200/80">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
          Connected Hospitals & Clinics
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Healthcare institutions with active ABDM/FHIR connectivity or patient consent grants
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hospitals.map((h) => (
          <Card key={h.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                    NH
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">{h.name}</h3>
                    <p className="text-xs text-slate-500">{h.type}</p>
                  </div>
                </div>
                <Badge variant="success">Connected</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{h.address}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{h.phone} &bull; {h.email}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-400">Consent: {h.status}</span>
                <Link href="/privacy" className="text-xs font-semibold text-emerald-700 hover:underline">
                  Manage Permissions &rarr;
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
