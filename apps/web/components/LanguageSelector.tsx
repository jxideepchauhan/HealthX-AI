'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LanguageCode } from '@/lib/i18n/languages';
import { Globe, Check, ChevronDown } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'compact' | 'full' | 'pill';
  className?: string;
}

export function LanguageSelector({ variant = 'compact', className = '' }: LanguageSelectorProps) {
  const { language, currentLanguage, supportedLanguages, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {variant === 'pill' ? (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80 text-xs font-semibold shadow-sm transition"
          aria-expanded={open}
          aria-haspopup="true"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-600" />
          <span>{currentLanguage.flag}</span>
          <span>{currentLanguage.nativeName}</span>
          <ChevronDown className="w-3 h-3 text-emerald-600 ml-0.5" />
        </button>
      ) : variant === 'compact' ? (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-sm transition"
          aria-expanded={open}
          aria-haspopup="true"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{currentLanguage.flag} {currentLanguage.nativeName}</span>
          </div>
          <ChevronDown className="w-3 h-3 text-slate-400 shrink-0 ml-1" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-sm transition"
          aria-expanded={open}
          aria-haspopup="true"
        >
          <Globe className="w-4 h-4 text-emerald-600" />
          <span>{currentLanguage.flag} {currentLanguage.nativeName} ({currentLanguage.name})</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
        </button>
      )}

      {open && (
        <div className="absolute right-0 bottom-full mb-2 lg:bottom-auto lg:top-full lg:mt-1.5 w-56 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-[100] animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {t.language} / Select Language
            </span>
            <span className="text-[10px] text-emerald-600 font-mono font-medium">10 Languages</span>
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {supportedLanguages.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code as LanguageCode)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs transition ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-700 hover:bg-slate-50 font-normal'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">{lang.flag}</span>
                    <div className="text-left">
                      <p className="leading-none">{lang.nativeName}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{lang.name}</p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
