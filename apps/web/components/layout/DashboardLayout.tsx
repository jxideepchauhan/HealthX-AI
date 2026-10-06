'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const DESKTOP_NAV: NavItem[] = [
  { name: 'Home', href: '/dashboard', icon: Activity },
  { name: 'Health Journey', href: '/journey', icon: HeartPulse },
  { name: 'Medical Records', href: '/records', icon: FileText },
  { name: 'AI Copilot', href: '/assistant', icon: MessageSquare },
  { name: 'Lab Results', href: '/labs', icon: FlaskConical },
  { name: 'Medications', href: '/medications', icon: Pill },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Doctors & Hospitals', href: '/doctors', icon: Users },
  { name: 'Doctor Visit Mode', href: '/doctor-visit', icon: Stethoscope },
  { name: 'Emergency', href: '/emergency', icon: ShieldAlert },
  { name: 'Privacy & Consent', href: '/privacy', icon: Lock },
  { name: 'Profile', href: '/profile', icon: User },
];

const MOBILE_NAV: NavItem[] = [
  { name: 'Home', href: '/dashboard', icon: Activity },
  { name: 'Journey', href: '/journey', icon: HeartPulse },
  { name: 'Records', href: '/records', icon: FileText },
  { name: 'AI', href: '/assistant', icon: MessageSquare },
  { name: 'Profile', href: '/profile', icon: User },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-slate-200/80 p-5 shrink-0 select-none">
        <div className="flex items-center gap-2.5 px-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 font-bold text-lg">
            HX
          </div>
          <div>
            <h1 className="font-bold text-slate-900 tracking-tight leading-none text-base">HEALTHX AI</h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider mt-1">PERSONAL HEALTH COPILOT</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {DESKTOP_NAV.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
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

        {/* Portal Shortcuts */}
        <div className="pt-4 border-t border-slate-100 space-y-1 mt-4">
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Portals & Admin</p>
          <Link
            href="/doctor"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          >
            <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
            <span>Doctor Portal</span>
          </Link>
          <Link
            href="/hospital"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          >
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Hospital Portal</span>
          </Link>
          <Link
            href="/admin/ml"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          >
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
            <span>ML Registry</span>
          </Link>
        </div>

        <div className="pt-4 mt-auto">
          <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600/10 flex items-center justify-center text-emerald-700 font-bold text-xs">
              IN
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-800 truncate">Isaac Noronha</p>
              <p className="text-[10px] text-emerald-700 font-medium">A+ &bull; 18 yrs &bull; Active</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        {/* Top Header for Mobile & Quick Actions */}
        <header className="lg:hidden flex items-center justify-between bg-white border-b border-slate-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
              HX
            </div>
            <span className="font-bold text-slate-900 text-sm">HEALTHX AI</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile expanded drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 p-4 space-y-2">
            {DESKTOP_NAV.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                <item.icon className="w-4 h-4 text-slate-400" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        )}

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">{children}</main>

        {/* MOBILE BOTTOM NAVIGATION (Section 7) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex items-center justify-around py-2 z-50">
          {MOBILE_NAV.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
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
