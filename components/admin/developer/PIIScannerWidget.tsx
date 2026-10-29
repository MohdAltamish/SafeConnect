'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Search, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

interface LeakFinding {
  id: string;
  type: string;
  field: string;
  matches: string[];
  contextSnippet: string;
  detectedAt: string;
}

export function PIIScannerWidget() {
  const [findings, setFindings] = useState<LeakFinding[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [redactingId, setRedactingId] = useState<string | null>(null);
  const [scanRun, setScanRun] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runScan = async () => {
    setIsScanning(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/developer/pii-scan');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to scan database');
      }
      setFindings(data.leaks || []);
      setScanRun(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error during scan');
    } finally {
      setIsScanning(false);
    }
  };

  const redactFinding = async (docId: string) => {
    setRedactingId(docId);
    try {
      const res = await fetch('/api/admin/developer/pii-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to redact PII');
      }
      // Remove from findings list
      setFindings((prev) => prev.filter((f) => f.id !== docId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Redaction failed');
    } finally {
      setRedactingId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-primary" />
          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              Zero-PII Leak Scanner & Redaction Engine
            </h3>
            <p className="text-[11px] text-text-muted">
              Scans reports & chat for accidental Indian phone numbers, 13-digit AKTU roll numbers, or emails.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={runScan}
          disabled={isScanning}
          className="flex items-center gap-1.5"
        >
          {isScanning ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Search className="w-3.5 h-3.5" />
          )}
          Run PII Leak Scan
        </Button>
      </div>

      {error && <p className="text-xs text-error">{error}</p>}

      {scanRun && findings.length === 0 && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Zero PII detected! The database conforms 100% to Privacy Rule §1.</span>
        </div>
      )}

      {findings.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-error font-semibold">
            <AlertTriangle className="w-4 h-4" /> {findings.length} PII Leaks Flagged for Redaction
          </div>

          <div className="divide-y divide-border/60 rounded-xl border border-border overflow-hidden">
            {findings.map((f) => (
              <div key={f.id} className="p-3 bg-surface-tint flex items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-primary">{f.id}</span>
                    <span className="px-1.5 py-0.2 rounded bg-error-50 text-error border border-error/20 text-[10px] font-semibold">
                      {f.matches.join(', ')}
                    </span>
                  </div>
                  <p className="text-text-secondary text-[11px] italic">
                    &ldquo;{f.contextSnippet}&rdquo;
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={redactingId === f.id}
                  onClick={() => redactFinding(f.id)}
                  className="shrink-0 text-error hover:bg-error-50 border-error/30"
                >
                  {redactingId === f.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    'Redact String'
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
