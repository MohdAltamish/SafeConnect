'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { QuorumValidator } from './QuorumValidator';
import { REPORT_STATUS, SEVERITY, type ReportStatus, type Severity } from '@/types';
import { AlertCircle, Check, Loader2 } from 'lucide-react';

interface StatusDropdownProps {
  caseId: string;
  currentStatus: ReportStatus;
  currentSeverity?: Severity | null;
  onUpdated: (newStatus: ReportStatus, newSeverity?: Severity | null) => void;
}

export function StatusDropdown({
  caseId,
  currentStatus,
  currentSeverity,
  onUpdated,
}: StatusDropdownProps) {
  const [status, setStatus] = useState<ReportStatus>(currentStatus);
  const [severity, setSeverity] = useState<Severity | ''>(currentSeverity || '');
  const [closureNote, setClosureNote] = useState('');
  const [quorumMembers, setQuorumMembers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isResolving = status === REPORT_STATUS.ACTION_TAKEN || status === REPORT_STATUS.CLOSED;
  const isClosing = status === REPORT_STATUS.CLOSED;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (isResolving && quorumMembers.length < 3) {
      setError('Statutory quorum requirement: At least 3 committee members must be checked present.');
      return;
    }

    if (isClosing && (!closureNote || closureNote.trim().length < 10)) {
      setError('A formal closure note of at least 10 characters is mandatory per GLBITM grievance policy.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/cases/${caseId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          severity: severity ? severity : null,
          closureNote: isClosing ? closureNote.trim() : null,
          quorumMembers: isResolving ? quorumMembers : [],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update status');
      }

      setSuccess(true);
      onUpdated(status, severity ? (severity as Severity) : null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-surface p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="text-sm font-semibold text-text-primary">
          Lifecycle Status & Severity Management
        </h3>
        {success && (
          <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <Check className="w-3.5 h-3.5" /> Updated
          </span>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-error-50 border border-error/20 flex items-start gap-2 text-xs text-error">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Status selector */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            Case Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ReportStatus)}
            className="w-full text-xs rounded-lg border border-border bg-surface px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value={REPORT_STATUS.NEW}>NEW (Initial Submission)</option>
            <option value={REPORT_STATUS.UNDER_REVIEW}>UNDER REVIEW (Committee Convened)</option>
            <option value={REPORT_STATUS.ACTION_TAKEN}>ACTION TAKEN (Measures Implemented)</option>
            <option value={REPORT_STATUS.CLOSED}>CLOSED (Findings Filed)</option>
          </select>
        </div>

        {/* Severity matrix */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            Severity Rating
          </label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value as Severity)}
            className="w-full text-xs rounded-lg border border-border bg-surface px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Unassigned</option>
            <option value={SEVERITY.LOW}>LOW (Informal Advisory / First Notice)</option>
            <option value={SEVERITY.MEDIUM}>MEDIUM (Inquiry Warranted)</option>
            <option value={SEVERITY.HIGH}>HIGH (Immediate Protective Action Required)</option>
          </select>
        </div>
      </div>

      {/* Quorum Validator required for Action Taken or Closed */}
      {isResolving && (
        <div className="pt-2">
          <QuorumValidator
            selectedMembers={quorumMembers}
            onChange={setQuorumMembers}
            requiredQuorum={3}
          />
        </div>
      )}

      {/* Formal Closure Note */}
      {isClosing && (
        <div className="space-y-1.5 pt-2">
          <label className="block text-xs font-medium text-text-secondary">
            Mandatory Statutory Closure Note & Findings <span className="text-error">*</span>
          </label>
          <textarea
            value={closureNote}
            onChange={(e) => setClosureNote(e.target.value)}
            rows={3}
            placeholder="Summarize committee findings, recommendations to Director, or actions enforced..."
            className="w-full text-xs rounded-lg border border-border bg-surface p-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <p className="text-[10px] text-text-muted">
            Minimum 10 characters required. Recorded immutably in statutory audit log.
          </p>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="flex items-center gap-1.5"
        >
          {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Apply Status Changes
        </Button>
      </div>
    </form>
  );
}
