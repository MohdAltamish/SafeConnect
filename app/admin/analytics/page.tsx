'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { type Report, CATEGORY_LABELS, DEPARTMENT_LABELS } from '@/types';
import { BarChart3, ShieldCheck, Loader2 } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [cases, setCases] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/cases')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const list = data?.reports || data?.cases;
        if (list) setCases(list);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const total = cases.length;
  const newCases = cases.filter((c) => c.status === 'NEW').length;
  const underReview = cases.filter((c) => c.status === 'UNDER_REVIEW').length;
  const actionTaken = cases.filter((c) => c.status === 'ACTION_TAKEN').length;
  const closed = cases.filter((c) => c.status === 'CLOSED').length;
  const resolved = actionTaken + closed;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Category counts
  const categoryCounts: Record<string, number> = {};
  cases.forEach((c) => {
    const label = CATEGORY_LABELS[c.category] || c.category;
    categoryCounts[label] = (categoryCounts[label] || 0) + 1;
  });

  // Department counts
  const deptCounts: Record<string, number> = {};
  cases.forEach((c) => {
    const label = DEPARTMENT_LABELS[c.routedTo] || c.routedTo;
    deptCounts[label] = (deptCounts[label] || 0) + 1;
  });

  if (isLoading) {
    return (
      <Card padding="lg">
        <div className="flex flex-col items-center justify-center py-16 text-text-muted space-y-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <p className="text-xs">Computing aggregated committee analytics...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold text-text-primary tracking-tight">
              Institutional Grievance Analytics
            </h1>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            GLBITM Statutory Compliance & Redressal Metrics (Zero-PII Aggregated)
          </p>
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" /> Privacy-Safe Metrics
        </span>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border shadow-xs">
          <span className="text-[11px] font-medium text-text-muted block">
            Total Grievances
          </span>
          <span className="text-2xl font-bold text-text-primary mt-1 block">
            {total}
          </span>
          <span className="text-[10px] text-text-muted mt-0.5 block">
            All campus cells
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border shadow-xs">
          <span className="text-[11px] font-medium text-text-muted block">
            Pending Meeting (New)
          </span>
          <span className="text-2xl font-bold text-amber-600 mt-1 block">
            {newCases}
          </span>
          <span className="text-[10px] text-text-muted mt-0.5 block">
            Under 7-day SLA window
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border shadow-xs">
          <span className="text-[11px] font-medium text-text-muted block">
            Under Formal Inquiry
          </span>
          <span className="text-2xl font-bold text-primary mt-1 block">
            {underReview}
          </span>
          <span className="text-[10px] text-text-muted mt-0.5 block">
            Committee convened
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border shadow-xs">
          <span className="text-[11px] font-medium text-text-muted block">
            Resolution Rate
          </span>
          <span className="text-2xl font-bold text-emerald-600 mt-1 block">
            {resolutionRate}%
          </span>
          <span className="text-[10px] text-text-muted mt-0.5 block">
            {resolved} cases addressed
          </span>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="rounded-2xl border border-border bg-surface p-5 space-y-3">
          <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
            Incidents by Category
          </h3>
          <div className="space-y-2 text-xs">
            {Object.keys(categoryCounts).length === 0 ? (
              <p className="text-text-muted text-xs py-4 text-center">No reports recorded.</p>
            ) : (
              Object.entries(categoryCounts).map(([cat, count]) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-text-primary">{cat}</span>
                      <span className="text-text-muted">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-surface-tint rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Department Distribution */}
        <div className="rounded-2xl border border-border bg-surface p-5 space-y-3">
          <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
            Distribution by Handling Cell
          </h3>
          <div className="space-y-2 text-xs">
            {Object.keys(deptCounts).length === 0 ? (
              <p className="text-text-muted text-xs py-4 text-center">No reports recorded.</p>
            ) : (
              Object.entries(deptCounts).map(([dept, count]) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={dept} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-text-primary">{dept}</span>
                      <span className="text-text-muted">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-surface-tint rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-2 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
