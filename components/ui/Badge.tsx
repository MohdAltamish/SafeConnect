import React from 'react';
import { type ReportStatus, STATUS_LABELS } from '@/types';

interface BadgeProps {
  status: ReportStatus;
  className?: string;
}

/**
 * Status Badge — pill shape, color-coded per Design.md §5:
 * New = neutral gray, Under Review = warning gold,
 * Action Taken = navy, Closed = success green
 * Status is conveyed by both color AND text label (WCAG accessibility).
 */
export function Badge({ status, className = '' }: BadgeProps) {
  const statusStyles: Record<ReportStatus, string> = {
    NEW: 'bg-neutral/10 text-neutral border-neutral/20',
    UNDER_REVIEW: 'bg-warning/10 text-warning border-warning/20',
    ACTION_TAKEN: 'bg-secondary/10 text-secondary border-secondary/20',
    CLOSED: 'bg-success/10 text-success border-success/20',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[status]} ${className}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
