'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, Language, LanguageCode } from './languages';
import { TRANSLATIONS, TranslationDictionary } from './translations';

interface LanguageContextType {
  language: LanguageCode;
  currentLanguage: Language;
  supportedLanguages: Language[];
  setLanguage: (code: LanguageCode) => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextType>({
  language: DEFAULT_LANGUAGE,
  currentLanguage: SUPPORTED_LANGUAGES[0],
  supportedLanguages: SUPPORTED_LANGUAGES,
  setLanguage: () => {},
  t: TRANSLATIONS.en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);

  // Sync Google Translate cookie and trigger widget
  const syncGoogleTranslate = (code: LanguageCode) => {
    if (typeof document === 'undefined') return;
    try {
      const hostname = window.location.hostname;
      if (code === 'en') {
        document.cookie = 'googtrans=/en/en; path=/;';
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        if (hostname && hostname !== 'localhost') {
          document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
        }
      } else {
        document.cookie = `googtrans=/en/${code}; path=/;`;
        if (hostname && hostname !== 'localhost') {
          document.cookie = `googtrans=/en/${code}; path=/; domain=${hostname};`;
        }
      }

      // If Google Translate dropdown exists, trigger selection
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (select) {
        select.value = code;
        select.dispatchEvent(new Event('change'));
      }
    } catch {
      // Ignore cookie errors
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('healthx_language') as LanguageCode;
      if (saved && TRANSLATIONS[saved]) {
        setLanguageState(saved);
        syncGoogleTranslate(saved);
      }

      // Inject Google Translate script once
      if (!(window as any).__healthx_gt_injected) {
        (window as any).__healthx_gt_injected = true;
        (window as any).googleTranslateElementInit = () => {
          if ((window as any).google && (window as any).google.translate) {
            new (window as any).google.translate.TranslateElement(
              {
                pageLanguage: 'en',
                includedLanguages: 'en,hi,gu,ta,te,mr,bn,kn,ml,pa',
                autoDisplay: false,
              },
              'google_translate_element'
            );
          }
        };

        const script = document.createElement('script');
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
      }
    }

    const onLangChange = (e: any) => {
      if (e.detail && TRANSLATIONS[e.detail as LanguageCode]) {
        setLanguageState(e.detail as LanguageCode);
        syncGoogleTranslate(e.detail as LanguageCode);
      }
    };
    window.addEventListener('healthx_language_change', onLangChange);
    return () => window.removeEventListener('healthx_language_change', onLangChange);
  }, []);

  const setLanguage = (code: LanguageCode) => {
    if (!TRANSLATIONS[code]) return;
    setLanguageState(code);
    syncGoogleTranslate(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem('healthx_language', code);
      window.dispatchEvent(new CustomEvent('healthx_language_change', { detail: code }));
    }
  };

  const currentLanguage =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <LanguageContext.Provider
      value={{
        language,
        currentLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
        setLanguage,
        t,
      }}
    >
      <div id="google_translate_element" style={{ display: 'none' }} />
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

