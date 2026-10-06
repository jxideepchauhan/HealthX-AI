'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@healthx/ui';
import { apiFetch } from '@/lib/api';
import { ShieldCheck, Loader2 } from 'lucide-react';

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const identifier = searchParams.get('id') || '';
  const initialOtp = searchParams.get('otp') || '';

  const [otp, setOtp] = useState(initialOtp);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialOtp) {
      setOtp(initialOtp);
    }
  }, [initialOtp]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<{
        accessToken: string;
        user: { id: string; role: string };
      }>('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ identifier, otp }),
      });

      // Save token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('healthx_token', data.accessToken);
        localStorage.setItem('healthx_user', JSON.stringify(data.user));
      }

      // Route by role
      if (data.user.role === 'DOCTOR') {
        router.push('/doctor');
      } else if (data.user.role === 'HOSPITAL') {
        router.push('/hospital');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md w-full">
      <CardHeader className="text-center pb-2">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center mx-auto mb-3 text-sm">
          HX
        </div>
        <CardTitle>Verify Security Code</CardTitle>
        <CardDescription>
          Enter the 6-digit verification code sent to <span className="font-semibold text-slate-800">{identifier}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerify} className="space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
              {error}
            </div>
          )}

          <Input
            label="6-Digit OTP Code"
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="e.g. 123456"
            className="text-center tracking-widest text-lg font-mono"
            required
          />

          <Button type="submit" className="w-full mt-2" disabled={loading || otp.length < 6}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...
              </>
            ) : (
              'Verify & Access HealthX'
            )}
          </Button>

          <div className="pt-2 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted token generation with HTTP-only session cookies</span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyForm />
      </Suspense>
    </div>
  );
}
