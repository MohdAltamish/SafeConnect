'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatusDropdown } from './StatusDropdown';
import { AuthorityChat } from './AuthorityChat';
import { CommitteeNotes } from './CommitteeNotes';
import {
  type Report,
  type Message,
  type CommitteeNote,
  type ReportStatus,
  type Severity,
  CATEGORY_LABELS,
  DEPARTMENT_LABELS,
  STATUS_LABELS,
} from '@/types';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Printer,
  ShieldCheck,
  Paperclip,
  AlertTriangle,
} from 'lucide-react';

interface CaseDetailPanelProps {
  report: Report;
  initialMessages?: Message[];
  initialNotes?: CommitteeNote[];
}

export function CaseDetailPanel({
  report: initialReport,
  initialMessages = [],
  initialNotes = [],
}: CaseDetailPanelProps) {
  const [report, setReport] = useState<Report>(initialReport);

  const handleStatusUpdated = (newStatus: ReportStatus, newSeverity?: Severity | null) => {
    setReport((prev) => ({
      ...prev,
      status: newStatus,
      severity: newSeverity !== undefined ? newSeverity : prev.severity,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="p-2 rounded-lg border border-border bg-surface hover:bg-surface-tint text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-mono text-primary">
                {report.caseId}
              </h1>
              <Badge
                variant={
                  report.status === 'NEW'
                    ? 'warning'
                    : report.status === 'UNDER_REVIEW'
                    ? 'default'
                    : report.status === 'ACTION_TAKEN'
                    ? 'success'
                    : 'secondary'
                }
              >
                {STATUS_LABELS[report.status as ReportStatus] || report.status}
              </Badge>
              {report.severity && (
                <Badge
                  variant={
                    report.severity === 'HIGH'
                      ? 'error'
                      : report.severity === 'MEDIUM'
                      ? 'warning'
                      : 'outline'
                  }
                >
                  {report.severity} Priority
                </Badge>
              )}
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Assigned to {DEPARTMENT_LABELS[report.routedTo]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Export / Print Record
          </Button>
        </div>
      </div>

      {/* Grid: Details on Left, Actions on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Case Facts & Evidence */}
        <div className="lg:col-span-2 space-y-6">
          {/* Metadata Card */}
          <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
            <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider text-[11px]">
              Grievance Metadata
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-text-secondary bg-surface-tint p-2.5 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <span className="text-[10px] text-text-muted block">Category</span>
                  <span className="font-semibold text-text-primary">
                    {CATEGORY_LABELS[report.category] || report.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-text-secondary bg-surface-tint p-2.5 rounded-lg">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <span className="text-[10px] text-text-muted block">Campus Location</span>
                  <span className="font-semibold text-text-primary">
                    {report.location || 'Not specified'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-text-secondary bg-surface-tint p-2.5 rounded-lg">
                <Calendar className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <span className="text-[10px] text-text-muted block">Incident Date</span>
                  <span className="font-semibold text-text-primary">
                    {report.incidentDate
                      ? new Date(report.incidentDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'Approximate / Undated'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-text-secondary bg-surface-tint p-2.5 rounded-lg">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <span className="text-[10px] text-text-muted block">Report Filed</span>
                  <span className="font-semibold text-text-primary">
                    {new Date(report.createdAt).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-primary">
                  Student&apos;s Incident Narrative
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> BOG §1.2.7 Retaliation Prohibited
                </span>
              </div>
              <div className="p-4 rounded-xl border border-border bg-surface-tint/50 text-xs text-text-primary leading-relaxed whitespace-pre-wrap">
                {report.description}
              </div>
            </div>

            {/* Evidence List */}
            {report.evidenceUrls && report.evidenceUrls.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border">
                <span className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-primary" /> Submitted Evidence ({report.evidenceUrls.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {report.evidenceUrls.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-tint text-xs text-primary font-medium hover:underline inline-flex items-center gap-1"
                    >
                      Evidence Item #{i + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Anonymous Two-Way Chat */}
          <AuthorityChat
            caseId={report.caseId}
            department={report.routedTo}
            initialMessages={initialMessages}
          />
        </div>

        {/* Right Column: Status & Confidential Minutes */}
        <div className="space-y-6">
          {/* Status & Quorum Update */}
          <StatusDropdown
            caseId={report.caseId}
            currentStatus={report.status}
            currentSeverity={report.severity}
            onUpdated={handleStatusUpdated}
          />

          {/* Internal Committee Notes & Minutes */}
          <CommitteeNotes
            caseId={report.caseId}
            initialNotes={initialNotes}
          />
        </div>
      </div>
    </div>
  );
}
