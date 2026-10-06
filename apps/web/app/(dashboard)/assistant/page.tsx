'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input } from '@healthx/ui';
import { apiFetch } from '@/lib/api';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LanguageCode } from '@/lib/i18n/languages';
import {
  Sparkles,
  Send,
  Bot,
  User,
  FileText,
  AlertTriangle,
  Mic,
  Copy,
  Languages,
  Check,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
  citations?: Array<{
    documentId: string;
    documentTitle: string;
    page: number;
    field?: string;
    date?: string;
    excerpt: string;
  }>;
  safetyFlags?: {
    refusedDiagnosis?: boolean;
    refusedMedicationChange?: boolean;
    refusedDosageInvention?: boolean;
    insufficientEvidence?: boolean;
  };
}

export default function AssistantPage() {
  const { language: currentLangCode, currentLanguage, supportedLanguages, setLanguage: setGlobalLanguage, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: 'assistant',
      content:
        'Hello Isaac! I am HealthX AI, your personal health-record copilot. I can explain what your authorized medical records show, highlight lab trends, and cite original documents. How can I assist you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [detailLevel, setDetailLevel] = useState<'SIMPLE' | 'DETAILED'>('SIMPLE');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  const suggestedPrompts = [
    'What was my hemoglobin?',
    'Explain my ferritin levels and reference range',
    'Should I stop my medicine?',
    'What disease do I have?',
    'Give me a dosage for my medicine',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    setInput('');
    const newMessages: ChatMsg[] = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const data = await apiFetch<{
        answer: string;
        citations: any[];
        safety_flags: any;
        confidence: number;
      }>('/assistant/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: query,
          language: currentLanguage.name,
          detailLevel,
        }),
      });

      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: data.answer,
          citations: data.citations,
          safetyFlags: data.safety_flags,
        },
      ]);
    } catch (err: any) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: `Error: ${err.message || 'Unable to communicate with clinical assistant'}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-4">
      {/* COPILOT HEADER */}
      <div className="pb-2 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>{t.assistantTitle}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.assistantSubtitle}
          </p>
        </div>

        {/* Controls: Language & Detail Level (Section 70, 96) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 text-xs">
            <Languages className="w-3.5 h-3.5 text-slate-400 ml-1" />
            <select
              value={currentLangCode}
              onChange={(e) => setGlobalLanguage(e.target.value as LanguageCode)}
              className="bg-transparent border-0 text-xs font-semibold text-slate-800 focus:ring-0 cursor-pointer pr-2"
            >
              {supportedLanguages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.nativeName} ({l.name})
                </option>
              ))}
            </select>
          </div>

          <div className="flex rounded-lg border border-slate-200 p-0.5 bg-white text-xs">
            <button
              onClick={() => setDetailLevel('SIMPLE')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                detailLevel === 'SIMPLE' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Simple
            </button>
            <button
              onClick={() => setDetailLevel('DETAILED')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                detailLevel === 'DETAILED' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Detailed
            </button>
          </div>
        </div>
      </div>

      {/* CHAT MESSAGES SCROLL AREA */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 max-w-3xl ${
              msg.role === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs">
                HX
              </div>
            )}

            <div
              className={`rounded-2xl p-4 text-xs leading-relaxed space-y-2.5 shadow-2xs ${
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-xs'
                  : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-semibold text-[11px] opacity-75">
                  {msg.role === 'user' ? 'You' : 'HealthX AI'}
                </span>
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => copyToClipboard(msg.content, idx)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                    title="Copy message"
                  >
                    {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              <p className="whitespace-pre-wrap">{msg.content}</p>

              {/* CITATIONS BOX (Section 30) */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-1.5 mt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Source Citations & Evidentiary Proof
                  </span>
                  {msg.citations.map((c, i) => (
                    <div
                      key={i}
                      className="p-2 bg-emerald-50/50 rounded-lg border border-emerald-100 flex items-center justify-between text-[11px]"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <div>
                          <strong className="text-slate-900">{c.documentTitle}</strong>
                          <span className="text-slate-500 ml-1.5 font-mono">Page {c.page}</span>
                        </div>
                      </div>
                      <Link
                        href={`/records/${c.documentId}`}
                        className="text-emerald-700 font-semibold hover:underline"
                      >
                        View Source &rarr;
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {/* SAFETY ADVISORY FLAGS */}
              {msg.safetyFlags && (msg.safetyFlags.refusedDiagnosis || msg.safetyFlags.refusedMedicationChange) && (
                <div className="p-2 bg-amber-50 rounded-lg border border-amber-200/80 text-[10px] text-amber-800 flex items-center gap-1.5 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Clinical Safety Protocol Enforced: Medical diagnosis or prescription alteration was refused.</span>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 text-xs font-bold">
                IN
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-xl mr-auto">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">
              HX
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs flex items-center gap-2 text-slate-500 shadow-2xs">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Verifying clinical grounding against authorized records...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* SUGGESTED PROMPTS & CHAT INPUT */}
      <div className="space-y-2 shrink-0 pt-2 border-t border-slate-200/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">{t.suggestedQuestions}:</span>
          {suggestedPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              disabled={loading}
              className="px-2.5 py-1 bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 rounded-full text-[11px] whitespace-nowrap transition-all"
            >
              {p}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={() => setIsListening(!isListening)}
            className={`p-2.5 rounded-lg border transition-colors ${
              isListening ? 'bg-rose-50 border-rose-300 text-rose-600' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
            title="Speech input"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.askPlaceholder}
            className="flex-1 px-4 py-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
            disabled={loading}
          />

          <Button type="submit" size="sm" disabled={loading || !input.trim()} className="px-4 py-2.5">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
