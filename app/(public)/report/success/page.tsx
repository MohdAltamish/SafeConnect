'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Card } from '@/components/ui/Card';
import { Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

/**
 * Success page — per Design.md §7 and Workflow.md §7:
 * "The single most important screen in the product."
 *
 * - Large Case ID and Access Token in monospace inside a bordered card
 * - "Copy Token" button
 * - Prominent warning: "This is the only time you'll see this."
 * - No auto-advance, no timeout
 */
function SuccessContent() {
  const searchParams = useSearchParams();
  const caseId = searchParams.get('caseId');
  const token = searchParams.get('token');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  if (!caseId || !token) {
    return (
      <div className="text-center py-16">
        <p className="text-text-muted">No report data found. Please submit a report first.</p>
      </div>
    );
  }

  const copyToClipboard = async (text: string, type: 'id' | 'token') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'id') {
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
      } else {
        setCopiedToken(true);
        setTimeout(() => setCopiedToken(false), 2000);
      }
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  };

  return (
    <div className="w-full max-w-[640px] mx-auto">
      {/* Success indicator */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
          Report Submitted
        </h1>
        <p className="text-text-muted">
          Your report has been securely submitted and routed to the appropriate authority.
        </p>
      </div>

      {/* Warning banner — the Alert Banner from Design.md §5 */}
      <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-text-primary mb-1">
            This is the only time you&apos;ll see this.
          </p>
          <p className="text-xs text-text-muted leading-relaxed">
            We don&apos;t store your access token — save it now. You&apos;ll need both your Case ID and
            Access Token to check your report status or communicate with the authority. Take a
            screenshot or write them down.
          </p>
        </div>
      </div>

      {/* Case ID + Token display */}
      <Card padding="lg" className="mb-6">
        <div className="flex flex-col gap-6">
          {/* Case ID */}
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wide mb-2 font-medium">
              Case ID
            </p>
            <div className="flex items-center justify-between bg-surface-tint rounded-lg p-4 border border-border">
              <code className="text-xl sm:text-2xl font-bold font-mono text-primary tracking-wider">
                {caseId}
              </code>
              <button
                onClick={() => copyToClipboard(caseId, 'id')}
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors ml-3 min-h-[44px] px-3"
                aria-label="Copy Case ID"
              >
                {copiedId ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-success">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Access Token */}
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wide mb-2 font-medium">
              Access Token
            </p>
            <div className="flex items-center justify-between bg-surface-tint rounded-lg p-4 border border-border">
              <code className="text-xl sm:text-2xl font-bold font-mono text-text-primary tracking-wider break-all">
                {token}
              </code>
              <button
                onClick={() => copyToClipboard(token, 'token')}
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors ml-3 min-h-[44px] px-3"
                aria-label="Copy Access Token"
              >
                {copiedToken ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-success">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* What's next */}
      <Card padding="md" className="bg-surface-tint">
        <h3 className="text-sm font-semibold text-text-primary mb-2">What happens next?</h3>
        <ul className="text-xs text-text-muted space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            Your report has been automatically routed to the relevant college authority.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            You can check your report status anytime at{' '}
            <a href="/track" className="text-primary underline">Track Report</a>.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            If the authority has follow-up questions, you&apos;ll see them in the chat when you
            check your report.
          </li>
        </ul>
      </Card>
    </div>
  );
}

export default function ReportSuccessPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12">
        <Suspense fallback={
          <div className="text-center py-16">
            <p className="text-text-muted">Loading...</p>
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
