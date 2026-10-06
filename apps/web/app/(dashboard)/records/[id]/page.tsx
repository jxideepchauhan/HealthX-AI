'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input } from '@healthx/ui';
import { apiFetch } from '@/lib/api';
import {
  FileText,
  ZoomIn,
  ZoomOut,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export default function RecordDetailPage() {
  const routeParams = useParams();
  const id = (routeParams?.id as string) || '';
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [activePage, setActivePage] = useState(1);
  const [highlightField, setHighlightField] = useState<string | null>(null);

  useEffect(() => {
    async function loadDoc() {
      try {
        const res = await apiFetch<{ document: any }>(`/documents/${id}`);
        setDoc(res.document);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDoc();
  }, [id]);

  const handleVerifyEntity = async (entityId: string) => {
    try {
      await apiFetch(`/documents/${id}/verify`, {
        method: 'POST',
        body: JSON.stringify({
          entityId,
          verificationStatus: 'USER_VERIFIED',
        }),
      });

      // Update state locally
      setDoc((prev: any) => ({
        ...prev,
        extractedEntities: prev.extractedEntities.map((e: any) =>
          e.id === entityId ? { ...e, verificationStatus: 'USER_VERIFIED' } : e
        ),
      }));
    } catch (err) {
      alert('Failed to verify field');
    }
  };

  if (loading) return <div className="p-8 text-center text-xs text-slate-500">Loading document...</div>;
  if (!doc) return <div className="p-8 text-center text-xs text-slate-500">Document not found.</div>;

  const rawText = doc.pages?.[0]?.textContent || doc.ocrResult?.fullText || 'No text extracted.';

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link href="/records" className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold text-slate-900">{doc.title}</h1>
              <Badge variant="success">{doc.processingStatus}</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">{doc.fileName} &bull; {doc.fileType}</p>
          </div>
        </div>

        {/* Viewer Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(Math.max(70, zoom - 15))}
            className="p-1.5 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-600 px-1">{zoom}%</span>
          <button
            onClick={() => setZoom(Math.min(160, zoom + 15))}
            className="p-1.5 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* DOCUMENT VIEWER & SOURCE HIGHLIGHTING (Left 7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Document Preview &bull; Page {activePage} of {doc.pages?.length || 1}</span>
            {highlightField && (
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                Highlighting: {highlightField}
              </span>
            )}
          </div>

          <div className="bg-slate-900/5 p-4 rounded-xl border border-slate-200 min-h-[500px] overflow-auto flex justify-center">
            <div
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
              className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-sm border border-slate-200/80 font-mono text-xs leading-relaxed text-slate-800 transition-transform duration-150"
            >
              <div className="border-b border-slate-200 pb-4 mb-4 flex justify-between items-center text-[10px] text-slate-400">
                <span>HEALTHX DOCUMENT SECURE ARCHIVE</span>
                <span>ORIGIN: {doc.storageKey}</span>
              </div>

              {rawText.split('\n').map((line: string, i: number) => {
                const isHighlighted = highlightField && line.toLowerCase().includes(highlightField.toLowerCase());
                return (
                  <div
                    key={i}
                    className={`py-0.5 px-1 rounded transition-colors ${
                      isHighlighted ? 'bg-amber-100 text-amber-900 font-bold border-l-4 border-amber-500' : ''
                    }`}
                  >
                    {line}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* EXTRACTED MEDICAL ENTITIES & VERIFICATION (Right 5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Extracted Entities & AI Validation</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Review and verify clinical fields extracted by AI. Low-confidence extractions require user confirmation
                before becoming active health history.
              </p>

              {doc.extractedEntities && doc.extractedEntities.length > 0 ? (
                doc.extractedEntities.map((ent: any) => (
                  <div
                    key={ent.id}
                    onMouseEnter={() => setHighlightField(ent.value)}
                    onMouseLeave={() => setHighlightField(null)}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2 hover:border-emerald-300 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{ent.normalizedValue || ent.entityType}</span>
                      <Badge
                        variant={ent.verificationStatus === 'SOURCE_VERIFIED' || ent.verificationStatus === 'USER_VERIFIED' ? 'success' : 'warning'}
                      >
                        {ent.verificationStatus}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 font-mono">
                      <span>Value: <strong className="text-slate-900">{ent.value}</strong></span>
                      <span className="text-[10px] text-slate-400">Confidence: {Math.round(ent.confidence * 100)}%</span>
                    </div>

                    {ent.verificationStatus === 'UNVERIFIED' && (
                      <div className="pt-2 border-t border-slate-200 flex justify-end">
                        <Button
                          size="sm"
                          onClick={() => handleVerifyEntity(ent.id)}
                          className="text-xs py-1 px-2.5 h-auto"
                        >
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Verify Field
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-center py-4">No entities extracted yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
