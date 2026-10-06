'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@healthx/ui';
import { Stethoscope, Building2, Phone, Mail, Calendar, ShieldCheck } from 'lucide-react';

export default function DoctorsPage() {
  const doctors = [
    {
      id: 'doc-001',
      name: 'Dr. Raskik',
      specialization: 'Internal Medicine',
      hospital: 'Namo Hospital',
      location: 'Himachal Pradesh, India',
      status: 'Active Consent (ALL Records)',
      phone: '+91-9816000000',
      email: 'dr.raskik@namohospital.org',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200/80">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
          Care Team & Physicians
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Connected healthcare providers authorized to view your medical journey via consent
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doctors.map((d) => (
          <Card key={d.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                    DR
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">{d.name}</h3>
                    <p className="text-xs text-slate-500">{d.specialization}</p>
                  </div>
                </div>
                <Badge variant="success">Connected</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-600">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{d.hospital} &bull; {d.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{d.phone}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <Link href="/appointments">
                  <Button size="sm" variant="outline" className="text-xs">
                    Book Appointment
                  </Button>
                </Link>
                <Link href="/privacy">
                  <span className="text-xs text-emerald-700 font-semibold hover:underline">
                    Manage Consent &rarr;
                  </span>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
