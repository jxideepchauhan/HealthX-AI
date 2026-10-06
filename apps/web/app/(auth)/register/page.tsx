'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from '@healthx/ui';
import { ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center pb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center mx-auto mb-3 text-sm">
            HX
          </div>
          <CardTitle>Create HealthX Account</CardTitle>
          <CardDescription>Instant passwordless registration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed text-center">
            HealthX AI uses passwordless OTP verification. You can register instantly by requesting an OTP with your email or mobile.
          </p>

          <Link href="/login" className="block w-full">
            <Button className="w-full">
              Proceed to Sign In / Register <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
