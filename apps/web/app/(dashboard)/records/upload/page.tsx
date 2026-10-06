'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input } from '@healthx/ui';
import { apiFetch } from '@/lib/api';
import { Upload, ArrowLeft, Loader2, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';

export default function DocumentUploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [textPayload, setTextPayload] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      if (title) formData.append('title', title);
      if (textPayload) formData.append('textPayload', textPayload);
      if (file) formData.append('file', file);

      const token = typeof window !== 'undefined' ? localStorage.getItem('healthx_token') : null;
      const res = await fetch('/api/v1/documents', {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || 'Failed to upload document');
      }

      setSuccess(data);
      setTimeout(() => {
        router.push(`/records/${data.document_id}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Upload error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
        <Link href="/records" className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Upload Medical Document</h1>
          <p className="text-xs text-slate-500">Secure ingestion for PDF, PNG, JPG, or raw clinical notes</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Document queued for OCR & extraction! Redirecting to viewer...</span>
              </div>
            )}

            <Input
              label="Document Title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete Blood Count & Iron Studies"
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Upload File (PDF, PNG, JPG, JPEG)
              </label>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.tiff"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">Maximum file size: 25 MB</p>
            </div>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white px-2 text-slate-400">or enter plain text / OCR report</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Clinical Text Payload
              </label>
              <textarea
                rows={5}
                value={textPayload}
                onChange={(e) => setTextPayload(e.target.value)}
                placeholder="Paste report text or doctor's prescription..."
                className="w-full px-3.5 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Ingesting & Analyzing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" /> Submit Document
                </>
              )}
            </Button>

            <div className="pt-2 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>SHA-256 hash verified with duplicate record detection</span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
