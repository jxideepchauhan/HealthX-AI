'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  FileText,
  MessageSquare,
  FlaskConical,
  Pill,
  Calendar,
  Users,
  ShieldAlert,
  Lock,
  User,
  HeartPulse,
  Menu,
  X,
  Stethoscope,
  Building2,
  Cpu,
  LogOut,
  Globe,
} from 'lucide-react';
import { getStoredUser, ensureSession, switchDemoPersona, logout, StoredUser } from '@/lib/api';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);
  const { t } = useLanguage();

  const desktopNav = [
    { name: t.navHome, href: '/dashboard', icon: Activity },
    { name: t.navJourney, href: '/journey', icon: HeartPulse },
    { name: t.navRecords, href: '/records', icon: FileText },
    { name: t.navCopilot, href: '/assistant', icon: MessageSquare },
    { name: t.navLabs, href: '/labs', icon: FlaskConical },
    { name: t.navMedications, href: '/medications', icon: Pill },
    { name: t.navAppointments, href: '/appointments', icon: Calendar },
    { name: t.navDoctors, href: '/doctors', icon: Users },
    { name: t.navDoctorVisit, href: '/doctor-visit', icon: Stethoscope },
    { name: t.navEmergency, href: '/emergency', icon: ShieldAlert },
    { name: t.navPrivacy, href: '/privacy', icon: Lock },
    { name: t.navProfile, href: '/profile', icon: User },
  ];

  const mobileNav = [
    { name: t.navHome, href: '/dashboard', icon: Activity },
    { name: t.navJourney, href: '/journey', icon: HeartPulse },
    { name: t.navRecords, href: '/records', icon: FileText },
    { name: t.navCopilot, href: '/assistant', icon: MessageSquare },
    { name: t.navProfile, href: '/profile', icon: User },
  ];

  useEffect(() => {
    // If not authenticated, ensure active session for current page
    ensureSession().then(() => {
      setUser(getStoredUser());
    });

    const onAuthChange = (e: any) => {
      setUser(e.detail || getStoredUser());
    };
    window.addEventListener('healthx_auth_change', onAuthChange);
    return () => window.removeEventListener('healthx_auth_change', onAuthChange);
  }, []);

  const displayName = user?.name || user?.identifier || 'Isaac Noronha';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'IN';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-slate-200/80 p-5 shrink-0 select-none">
        <div className="flex items-center gap-2.5 px-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 font-bold text-lg">
            HX
          </div>
          <div>
            <h1 className="font-bold text-slate-900 tracking-tight leading-none text-base">HEALTHX AI</h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider mt-1">{t.personalCopilot}</p>
          </div>
        </div>

        {/* Global Language Selector (Desktop) */}
        <div className="mb-4 px-1">
          <LanguageSelector variant="compact" />
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
          {desktopNav.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-200/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Portal Shortcuts & Persona Switcher */}
        <div className="pt-3 border-t border-slate-100 space-y-1 mt-3">
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{t.switchPortal}</p>
          <button
            type="button"
            onClick={() => switchDemoPersona('DOCTOR')}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition text-left"
          >
            <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
            <span>{t.doctorPortal}</span>
          </button>
          <button
            type="button"
            onClick={() => switchDemoPersona('HOSPITAL')}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition text-left"
          >
            <Building2 className="w-3.5 h-3.5 text-purple-600" />
            <span>{t.hospitalPortal}</span>
          </button>
          <Link
            href="/admin/ml"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          >
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.mlRegistry}</span>
          </Link>
        </div>

        <div className="pt-3 mt-auto border-t border-slate-100">
          <div className="p-2.5 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-emerald-600/10 flex items-center justify-center text-emerald-700 font-bold text-xs shrink-0">
                {initials}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-800 truncate">{displayName}</p>
                <p className="text-[10px] text-emerald-700 font-mono truncate">{user?.uniqueId || user?.role || 'PAT-ISAAC-1001'}</p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              title={t.signOut}
              aria-label={t.signOut}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        {/* Top Header for Mobile & Quick Actions */}
        <header className="lg:hidden flex items-center justify-between bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
              HX
            </div>
            <span className="font-bold text-slate-900 text-sm">HEALTHX AI</span>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSelector variant="pill" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile expanded drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 p-4 space-y-2">
            <div className="pb-2 border-b border-slate-100">
              <LanguageSelector variant="compact" />
            </div>

            {desktopNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                <item.icon className="w-4 h-4 text-slate-400" />
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-1">
              <button
                type="button"
                onClick={() => switchDemoPersona('DOCTOR')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-blue-700 bg-blue-50"
              >
                <Stethoscope className="w-4 h-4 text-blue-600" />
                <span>{t.doctorPortal}</span>
              </button>
              <button
                type="button"
                onClick={() => switchDemoPersona('HOSPITAL')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-purple-700 bg-purple-50"
              >
                <Building2 className="w-4 h-4 text-purple-600" />
                <span>{t.hospitalPortal}</span>
              </button>
              <button
                onClick={() => logout()}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.signOut}</span>
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">{children}</main>

        {/* MOBILE BOTTOM NAVIGATION */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex items-center justify-around py-2 z-50">
          {mobileNav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 text-[10px] font-medium ${
                  isActive ? 'text-emerald-600' : 'text-slate-500'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
