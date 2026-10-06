'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@healthx/ui';
import { apiFetch } from '@/lib/api';
import { FileText, Upload, Eye, CheckCircle2, AlertCircle, Calendar, ArrowRight, Trash2 } from 'lucide-react';

export default function RecordsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocs();
  }, []);

  async function loadDocs() {
    try {
      const res = await apiFetch<{ documents: any[] }>('/documents');
      setDocuments(res.documents || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this medical record?')) return;
    try {
      await apiFetch(`/documents/${id}`, { method: 'DELETE' });
      setDocuments(documents.filter((d) => d.id !== id));
    } catch (err) {
      alert('Failed to delete document');
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Medical Records & Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Original medical files, extracted structured data, and verification statuses
          </p>
        </div>

        <Link href="/records/upload">
          <Button size="sm" className="flex items-center gap-1.5 shadow-sm">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New Document</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => {
          const confidencePct = Math.round((doc.ocrResult?.confidence || 0.95) * 100);
          return (
            <Card key={doc.id} className="hover:shadow-sm transition-all flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 line-clamp-1">{doc.title}</h3>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{doc.fileName}</p>
                    </div>
                  </div>
                  <Badge variant={doc.processingStatus === 'COMPLETED' ? 'success' : 'warning'}>
                    {doc.processingStatus}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0 flex-1 flex flex-col justify-between text-xs space-y-4">
                <div className="space-y-1.5 text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date Added:</span>
                    <span className="font-medium text-slate-800">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">AI OCR Confidence:</span>
                    <span className="font-semibold text-emerald-700 font-mono">{confidencePct}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Handwriting:</span>
                    <span className="font-medium text-slate-800">
                      {doc.ocrResult?.isHandwritten ? 'Detected' : 'Printed'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <Link href={`/records/${doc.id}`}>
                    <Button size="sm" variant="outline" className="flex items-center gap-1 text-xs">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Open Viewer</span>
                    </Button>
                  </Link>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
