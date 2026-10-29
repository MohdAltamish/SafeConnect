'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Wrench, Sparkles, Trash2, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export function DatabaseRepairTool() {
  const [runningAction, setRunningAction] = useState<string | null>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runRepair = async (action: 'REPAIR_UNROUTED' | 'SEED_STAGING' | 'PURGE_STAGING') => {
    setRunningAction(action);
    setResultMessage(null);
    setError(null);

    try {
      const res = await fetch('/api/admin/developer/repair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Operation failed');
      }
      setResultMessage(data.message || `Action ${action} completed successfully.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error executing repair action');
    } finally {
      setRunningAction(null);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-text-primary">
            Database Self-Healing & Staging Controls
          </h3>
        </div>
      </div>

      {resultMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{resultMessage}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-error-50 border border-error/20 text-xs text-error">
          <AlertCircle className="w-4 h-4 text-error shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Reroute orphaned */}
        <div className="p-3.5 rounded-xl border border-border bg-surface-tint flex flex-col justify-between space-y-3">
          <div>
            <h4 className="font-semibold text-xs text-text-primary">
              Auto-Repair Routing
            </h4>
            <p className="text-[11px] text-text-muted mt-1">
              Scans for grievances with missing or null departments and applies statutory routing.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            disabled={runningAction !== null}
            onClick={() => runRepair('REPAIR_UNROUTED')}
            className="w-full text-xs"
          >
            {runningAction === 'REPAIR_UNROUTED' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
            ) : null}
            Repair Unrouted
          </Button>
        </div>

        {/* Seed staging */}
        <div className="p-3.5 rounded-xl border border-border bg-surface-tint flex flex-col justify-between space-y-3">
          <div>
            <h4 className="font-semibold text-xs text-text-primary flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Seed Training Data
            </h4>
            <p className="text-[11px] text-text-muted mt-1">
              Creates 5 realistic test cases with simulated chat history for committee training sessions.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            disabled={runningAction !== null}
            onClick={() => runRepair('SEED_STAGING')}
            className="w-full text-xs"
          >
            {runningAction === 'SEED_STAGING' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
            ) : null}
            Generate Mock Cases
          </Button>
        </div>

        {/* Purge staging */}
        <div className="p-3.5 rounded-xl border border-border bg-surface-tint flex flex-col justify-between space-y-3">
          <div>
            <h4 className="font-semibold text-xs text-text-primary flex items-center gap-1 text-error">
              <Trash2 className="w-3.5 h-3.5" /> Purge Staging Data
            </h4>
            <p className="text-[11px] text-text-muted mt-1">
              Safely removes all mock training reports without touching real student submissions.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            disabled={runningAction !== null}
            onClick={() => runRepair('PURGE_STAGING')}
            className="w-full text-xs border-error/30 text-error hover:bg-error-50"
          >
            {runningAction === 'PURGE_STAGING' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
            ) : null}
            Purge Mock Cases
          </Button>
        </div>
      </div>
    </div>
  );
}
