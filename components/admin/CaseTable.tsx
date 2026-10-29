'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import {
  type Report,
  type ReportStatus,
  REPORT_STATUS,
  CATEGORY_LABELS,
  DEPARTMENT_LABELS,
  STATUS_LABELS,
} from '@/types';
import {
  Search,
  Clock,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

interface CaseTableProps {
  cases: Report[];
}

export function CaseTable({ cases }: CaseTableProps) {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate statutory SLA
  const getSlaBadge = (report: Report) => {
    if (report.status === REPORT_STATUS.CLOSED) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] text-text-muted">
          Closed
        </span>
      );
    }

    const createdTime = new Date(report.createdAt).getTime();
    const now = Date.now();
    const daysSince = Math.floor((now - createdTime) / (1000 * 60 * 60 * 24));

    if (report.status === REPORT_STATUS.NEW) {
      // 7-day statutory meeting mandate
      const daysRemaining = 7 - daysSince;
      if (daysRemaining <= 0) {
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-error-50 text-error border border-error/30 animate-pulse">
            <AlertTriangle className="w-3 h-3" /> Meeting Overdue!
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="w-3 h-3" /> Meet in {daysRemaining}d
        </span>
      );
    }

    if (report.status === REPORT_STATUS.UNDER_REVIEW) {
      // 14-day statutory recommendation mandate
      const daysRemaining = 14 - daysSince;
      if (daysRemaining <= 0) {
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-error-50 text-error border border-error/30">
            <AlertTriangle className="w-3 h-3" /> Recs Overdue
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
          <Clock className="w-3 h-3" /> Recs due in {daysRemaining}d
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700">
        In Progress
      </span>
    );
  };

  const filteredCases = useMemo(() => {
    return cases
      .filter((c) => {
        if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          c.caseId.toLowerCase().includes(q) ||
          (c.location && c.location.toLowerCase().includes(q)) ||
          CATEGORY_LABELS[c.category]?.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        // High severity floats to top
        if (a.severity === 'HIGH' && b.severity !== 'HIGH') return -1;
        if (b.severity === 'HIGH' && a.severity !== 'HIGH') return 1;
        // Then newest first
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [cases, filterStatus, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Triage filters and search bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status filters */}
        <div className="flex flex-wrap items-center gap-1 bg-surface-tint p-1 rounded-xl border border-border">
          {[
            { id: 'ALL', label: 'All Cases' },
            { id: REPORT_STATUS.NEW, label: 'New' },
            { id: REPORT_STATUS.UNDER_REVIEW, label: 'Under Review' },
            { id: REPORT_STATUS.ACTION_TAKEN, label: 'Action Taken' },
            { id: REPORT_STATUS.CLOSED, label: 'Closed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filterStatus === tab.id
                  ? 'bg-surface text-primary shadow-xs font-semibold'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-[10px] opacity-70">
                (
                {tab.id === 'ALL'
                  ? cases.length
                  : cases.filter((c) => c.status === tab.id).length}
                )
              </span>
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Case ID, location..."
            className="w-full text-xs rounded-xl border border-border bg-surface pl-8 pr-3 py-2 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Cases Table */}
      <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-xs">
        {filteredCases.length === 0 ? (
          <div className="text-center py-12 px-4">
            <p className="text-sm text-text-muted">No grievances matching your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-tint/60 text-text-muted uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">Case ID</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold">Severity</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Statutory SLA</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredCases.map((c) => (
                  <tr
                    key={c.id || c.caseId}
                    className="hover:bg-surface-tint/40 transition-colors group cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-primary">
                      <Link
                        href={`/admin/case/${c.caseId}`}
                        className="hover:underline flex items-center gap-1"
                      >
                        {c.caseId}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-text-primary">
                      {CATEGORY_LABELS[c.category] || c.category}
                      <span className="block text-[10px] text-text-muted font-normal mt-0.5">
                        {DEPARTMENT_LABELS[c.routedTo]}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary">
                      {c.location || 'Not specified'}
                    </td>
                    <td className="py-3.5 px-4">
                      {c.severity ? (
                        <Badge
                          variant={
                            c.severity === 'HIGH'
                              ? 'error'
                              : c.severity === 'MEDIUM'
                              ? 'warning'
                              : 'outline'
                          }
                          size="sm"
                        >
                          {c.severity}
                        </Badge>
                      ) : (
                        <span className="text-[11px] text-text-muted">Unset</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          c.status === 'NEW'
                            ? 'warning'
                            : c.status === 'UNDER_REVIEW'
                            ? 'default'
                            : c.status === 'ACTION_TAKEN'
                            ? 'success'
                            : 'secondary'
                        }
                        size="sm"
                      >
                        {STATUS_LABELS[c.status as ReportStatus] || c.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      {getSlaBadge(c)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/case/${c.caseId}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark group-hover:translate-x-0.5 transition-transform"
                      >
                        Review <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
