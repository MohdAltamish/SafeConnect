'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CaseDetailPanel } from '@/components/admin/CaseDetailPanel';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { type Report, type Message, type CommitteeNote } from '@/types';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function AdminCaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = (params?.caseId as string)?.toUpperCase();

  const [report, setReport] = useState<Report | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notes, setNotes] = useState<CommitteeNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!caseId) return;

    const fetchCase = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/cases/${caseId}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to load case');
        }
        setReport(data.report || data.case);
        setMessages(data.messages || []);
        setNotes(data.notes || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading grievance');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCase();
  }, [caseId]);

  if (isLoading) {
    return (
      <Card padding="lg">
        <div className="flex flex-col items-center justify-center py-16 text-text-muted space-y-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <p className="text-xs">Loading case file {caseId}...</p>
        </div>
      </Card>
    );
  }

  if (error || !report) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/admin/dashboard')}
          className="flex items-center gap-1.5 text-xs text-text-muted"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cases
        </Button>

        <div className="p-6 rounded-2xl bg-error-50 border border-error/20 flex items-start gap-3 text-xs text-error">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-semibold text-sm">Unable to View Grievance</h3>
            <p>{error || 'Case does not exist or belongs to another statutory committee.'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CaseDetailPanel
      report={report}
      initialMessages={messages}
      initialNotes={notes}
    />
  );
}
