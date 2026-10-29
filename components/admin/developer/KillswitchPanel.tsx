'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, AlertOctagon, Lock, Loader2, Check } from 'lucide-react';

export function KillswitchPanel() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [readOnlyMode, setReadOnlyMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    'SafeConnect is currently undergoing scheduled institutional maintenance. For urgent campus emergencies, contact NCW Helpline: 7827170170 or Security Control: 112.'
  );
  const [rateLimit, setRateLimit] = useState(30);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/developer/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maintenanceMode,
          readOnlyMode,
          maintenanceMessage,
          rateLimitPerMinute: rateLimit,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update maintenance settings');
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-warning/40 bg-surface p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-warning" />
          <h3 className="text-sm font-semibold text-text-primary">
            Emergency Break-Glass & Maintenance Controls
          </h3>
        </div>
        {savedSuccess && (
          <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <Check className="w-3.5 h-3.5" /> State Applied
          </span>
        )}
      </div>

      {error && <p className="text-xs text-error">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Maintenance Switch */}
        <div className="p-3.5 rounded-xl border border-border bg-surface-tint flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-text-primary flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-error" /> Maintenance Mode Switch
              </span>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="w-4 h-4 text-error rounded border-border focus:ring-error"
              />
            </div>
            <p className="text-[11px] text-text-muted mt-1">
              Diverts public reporting and tracking to holding screen. Authority dashboard remains open.
            </p>
          </div>
          {maintenanceMode && (
            <textarea
              value={maintenanceMessage}
              onChange={(e) => setMaintenanceMessage(e.target.value)}
              rows={2}
              className="mt-3 w-full text-[11px] rounded-lg border border-border bg-surface p-2 text-text-primary focus:outline-none"
            />
          )}
        </div>

        {/* Read-Only Lock & Flood Gate */}
        <div className="p-3.5 rounded-xl border border-border bg-surface-tint space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-text-primary flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-primary" /> Database Read-Only Lock
            </span>
            <input
              type="checkbox"
              checked={readOnlyMode}
              onChange={(e) => setReadOnlyMode(e.target.checked)}
              className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
            />
          </div>
          <p className="text-[11px] text-text-muted">
            Freezes all report and message submissions during system migrations or audits.
          </p>

          <div className="pt-2 border-t border-border flex items-center justify-between">
            <span className="text-[11px] font-medium text-text-secondary">
              Submission Rate Limiter (req/min)
            </span>
            <input
              type="number"
              min={5}
              max={500}
              value={rateLimit}
              onChange={(e) => setRateLimit(Number(e.target.value))}
              className="w-20 text-xs px-2 py-1 rounded border border-border bg-surface text-center"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-1.5"
        >
          {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Apply Emergency Controls
        </Button>
      </div>
    </div>
  );
}
