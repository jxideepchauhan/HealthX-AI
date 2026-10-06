'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@healthx/ui';
import { apiFetch } from '@/lib/api';
import {
  ShieldCheck,
  ArrowRight,
  Loader2,
  Lock,
  UserCheck,
  Building2,
  Stethoscope,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';

type RoleType = 'PATIENT' | 'DOCTOR' | 'HOSPITAL';
type AuthMode = 'PASSWORD' | 'OTP';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<RoleType>('DOCTOR');
  const [authMode, setAuthMode] = useState<AuthMode>('PASSWORD');
  const [identifier, setIdentifier] = useState('DOC-RASKIK-4091');
  const [password, setPassword] = useState('Doctor@123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Switch role and pre-fill credentials for easy access
  const handleRoleSelect = (selectedRole: RoleType) => {
    setRole(selectedRole);
    setError(null);
    if (selectedRole === 'DOCTOR') {
      setIdentifier('DOC-RASKIK-4091');
      setPassword('Doctor@123');
    } else if (selectedRole === 'HOSPITAL') {
      setIdentifier('HOSP-NAMO-001');
      setPassword('Hospital@123');
    } else {
      setIdentifier('PAT-ISAAC-1001');
      setPassword('Patient@123');
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<{
        accessToken: string;
        user: { role: string; uniqueId?: string; identifier: string; name?: string };
      }>('/auth/login-password', {
        method: 'POST',
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
          role,
        }),
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('healthx_token', data.accessToken);
        localStorage.setItem('healthx_user', JSON.stringify(data.user));
      }

      // Navigate to destination portal based on authenticated role
      if (data.user.role === 'DOCTOR') {
        router.push('/doctor');
      } else if (data.user.role === 'HOSPITAL') {
        router.push('/hospital');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your Unique ID and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<{ devOtpCode?: string; message: string }>('/auth/request-otp', {
        method: 'POST',
        body: JSON.stringify({ identifier, role }),
      });

      const q = new URLSearchParams({
        id: identifier,
        role,
        ...(data.devOtpCode ? { otp: data.devOtpCode } : {}),
      });
      router.push(`/verify?${q.toString()}`);
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full bg-white/95 backdrop-blur-md shadow-2xl border-slate-700/20">
        <CardHeader className="text-center pb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-bold flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl text-slate-900 font-extrabold tracking-tight">
            HealthX AI Portal Access
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Sign in with your Unique ID & Password or secure OTP
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Role Tabs */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Select Portal / Persona
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRoleSelect('DOCTOR')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  role === 'DOCTOR'
                    ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-500/20 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Stethoscope className="w-4 h-4 mb-1 text-blue-600" />
                Doctor Portal
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('HOSPITAL')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  role === 'HOSPITAL'
                    ? 'bg-purple-50 border-purple-600 text-purple-900 ring-2 ring-purple-500/20 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Building2 className="w-4 h-4 mb-1 text-purple-600" />
                Hospital Portal
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('PATIENT')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  role === 'PATIENT'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <UserCheck className="w-4 h-4 mb-1 text-emerald-600" />
                Patient Portal
              </button>
            </div>
          </div>

          {/* Quick Demo Pre-fills */}
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1.5 font-medium">
              <span className="flex items-center gap-1 text-slate-800 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Demo Credentials:
              </span>
              <span className="text-[10px] text-slate-400">Click to autofill</span>
            </div>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => handleRoleSelect('DOCTOR')}
                className="px-2 py-0.5 rounded bg-blue-100/70 hover:bg-blue-100 text-blue-800 font-medium border border-blue-200 transition"
              >
                Dr. Raskik (<code className="font-mono">DOC-RASKIK-4091</code>)
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('HOSPITAL')}
                className="px-2 py-0.5 rounded bg-purple-100/70 hover:bg-purple-100 text-purple-800 font-medium border border-purple-200 transition"
              >
                Namo Hospital (<code className="font-mono">HOSP-NAMO-001</code>)
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('PATIENT')}
                className="px-2 py-0.5 rounded bg-emerald-100/70 hover:bg-emerald-100 text-emerald-800 font-medium border border-emerald-200 transition"
              >
                Isaac Noronha (<code className="font-mono">PAT-ISAAC-1001</code>)
              </button>
            </div>
          </div>

          {/* Auth Method Selector */}
          <div className="flex items-center border-b border-slate-200 pb-2 gap-4">
            <button
              type="button"
              onClick={() => setAuthMode('PASSWORD')}
              className={`text-xs font-semibold pb-1 border-b-2 transition ${
                authMode === 'PASSWORD'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Unique ID & Password
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('OTP')}
              className={`text-xs font-semibold pb-1 border-b-2 transition ${
                authMode === 'OTP'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Passwordless OTP
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-start gap-2">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          {/* Form */}
          {authMode === 'PASSWORD' ? (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {role === 'DOCTOR'
                    ? 'Unique Doctor ID / License or Email'
                    : role === 'HOSPITAL'
                    ? 'Unique Hospital Code or Email'
                    : 'Unique Patient ID or Email'}
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      role === 'DOCTOR'
                        ? 'DOC-RASKIK-4091 or dr.raskik@namohospital.org'
                        : role === 'HOSPITAL'
                        ? 'HOSP-NAMO-001 or admin@namohospital.org'
                        : 'PAT-ISAAC-1001 or isaac.noronha@example.com'
                    }
                    required
                    className="font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-700">Password</label>
                  <span className="text-[10px] text-slate-400">Default: Doctor@123 / Hospital@123</span>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className={`w-full py-2.5 text-xs font-semibold ${
                  role === 'DOCTOR'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : role === 'HOSPITAL'
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying Credentials...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" /> Sign in to {role.charAt(0) + role.slice(1).toLowerCase()} Portal
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Registered Email or Mobile Identifier
                </label>
                <Input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. dr.raskik@namohospital.org"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Dispatching OTP...
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 mr-2" /> Send 6-Digit OTP <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          )}

          <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100 flex items-center justify-between">
            <Link href="/" className="text-slate-500 hover:text-slate-900">
              ← Back to Home
            </Link>
            <Link href="/register" className="text-emerald-600 hover:underline font-medium">
              Create Patient Account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
