'use client';

import React, { useEffect, useState } from 'react';
import { CaseTable } from '@/components/admin/CaseTable';
import { Card } from '@/components/ui/Card';
import { type Report } from '@/types';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminDashboardPage() {
  const [cases, setCases] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCases = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/cases');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch cases');
      }
      setCases(data.reports || data.cases || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching cases');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">
            Grievance Redressal Triage
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            AICTE 2016 Statutory Hearing & Investigation Desk
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCases}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-xs h-8"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Queue
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-error-50 border border-error/20 flex items-start gap-2.5 text-xs text-error">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <Card padding="lg">
          <div className="flex flex-col items-center justify-center py-12 text-text-muted space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <p className="text-xs">Loading departmental grievances...</p>
          </div>
        </Card>
      ) : (
        <CaseTable cases={cases} />
      )}
    </div>
  );
}
