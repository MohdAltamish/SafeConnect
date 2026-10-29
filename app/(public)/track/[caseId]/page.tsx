'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ChatThread } from '@/components/shared/ChatThread';
import {
  Shield,
  Send,
  Loader2,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  Lock,
  ArrowLeft,
  Paperclip,
} from 'lucide-react';
import {
  type Report,
  type Message,
  DEPARTMENT_LABELS,
  STATUS_LABELS,
} from '@/types';

export default function StudentCaseTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const rawCaseId = params?.caseId as string;
  const caseId = rawCaseId?.toUpperCase() || '';

  const [accessToken, setAccessToken] = useState('');
  const [report, setReport] = useState<Report | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [tokenInput, setTokenInput] = useState('');

  // Fetch report details and messages
  const loadCaseData = useCallback(
    async (token: string) => {
      if (!caseId || !token) return;
      setError('');

      try {
        // 1. Fetch report details
        const repRes = await fetch(
          `/api/reports/${caseId}?accessToken=${encodeURIComponent(token)}`
        );
        if (!repRes.ok) {
          setError("We couldn't find a matching case. Please verify your Access Token.");
          setIsLoading(false);
          return;
        }
        const repData = await repRes.json();
        setReport(repData.report);

        // 2. Fetch messages
        const msgRes = await fetch(
          `/api/messages?caseId=${caseId}&accessToken=${encodeURIComponent(token)}`
        );
        if (msgRes.ok) {
          const msgData = await msgRes.json();
          setMessages(msgData.messages || []);
        }
      } catch {
        setError('Network error while loading case details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [caseId]
  );

  // Initialize token from sessionStorage or demo
  useEffect(() => {
    if (!caseId) return;

    let storedToken = sessionStorage.getItem(`sc-token-${caseId}`);
    if (!storedToken && caseId === 'SC-7X9K2') {
      storedToken = 'SafeConnect2026!';
    }

    if (storedToken) {
      setAccessToken(storedToken);
      loadCaseData(storedToken);
    } else {
      setIsLoading(false);
    }
  }, [caseId, loadCaseData]);

  // Periodic polling for new messages every 10 seconds
  useEffect(() => {
    if (!caseId || !accessToken || !report) return;

    const interval = setInterval(async () => {
      try {
        const msgRes = await fetch(
          `/api/messages?caseId=${caseId}&accessToken=${encodeURIComponent(accessToken)}`
        );
        if (msgRes.ok) {
          const msgData = await msgRes.json();
          setMessages(msgData.messages || []);
        }
      } catch {
        // Silent poll error
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [caseId, accessToken, report]);

  // Submit manual token if not in sessionStorage
  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    const cleanToken = tokenInput.trim();
    setAccessToken(cleanToken);
    sessionStorage.setItem(`sc-token-${caseId}`, cleanToken);
    setIsLoading(true);
    loadCaseData(cleanToken);
  };

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || isSending || !accessToken) return;

    const textToSend = newMessageText.trim();
    setIsSending(true);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId,
          accessToken,
          senderRole: 'student',
          text: textToSend,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      const data = await res.json();
      setMessages((prev) => [...prev, data.message]);
      setNewMessageText('');
    } catch {
      alert('Unable to deliver message. Please check your connection and try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-tint">
      <Navbar />

      <main className="flex-1 max-w-[900px] w-full mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.push('/track')}
            className="inline-flex items-center text-sm font-medium text-text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Case Lookup
          </button>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Lock className="w-3.5 h-3.5 text-success" />
            <span>End-to-End Anonymous</span>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <Card padding="lg" className="text-center py-16">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
            <p className="text-sm font-medium text-text-primary">Loading case & chat thread…</p>
          </Card>
        )}

        {/* Token required prompt */}
        {!isLoading && !accessToken && !report && (
          <Card padding="lg" className="max-w-[500px] mx-auto text-center py-10">
            <div className="w-12 h-12 rounded-full bg-primary-50 text-primary flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">Access Token Required</h2>
            <p className="text-sm text-text-muted mb-6">
              Enter the 16-character Access Token provided when you submitted case{' '}
              <strong className="text-text-primary">{caseId}</strong>.
            </p>
            <form onSubmit={handleTokenSubmit} className="flex flex-col gap-4 text-left">
              <Input
                label="Access Token"
                placeholder="Paste your 16-character token"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                autoComplete="off"
              />
              <Button type="submit" fullWidth>
                Access Case & Chat
              </Button>
            </form>
          </Card>
        )}

        {/* Error message */}
        {error && !isLoading && (
          <Card padding="md" className="mb-6 border-danger/30 bg-danger/5">
            <div className="flex items-start gap-3 text-danger text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Verification Failed</p>
                <p className="text-xs mt-0.5 text-danger/80">{error}</p>
                <button
                  onClick={() => {
                    sessionStorage.removeItem(`sc-token-${caseId}`);
                    setAccessToken('');
                    setReport(null);
                  }}
                  className="text-xs underline font-semibold mt-2 block"
                >
                  Enter a different Access Token
                </button>
              </div>
            </div>
          </Card>
        )}

        {/* Verified Case View & Chat */}
        {report && (
          <div className="flex flex-col gap-6">
            {/* Header Status Card */}
            <Card padding="lg" className="border-t-4 border-t-primary">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-border">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-text-muted">
                    Case Reference
                  </span>
                  <h1 className="text-2xl font-bold text-text-primary">{report.caseId}</h1>
                </div>
                <div className="text-right">
                  <Badge status={report.status} />
                  <p className="text-xs text-text-muted mt-1 font-medium">
                    Current Status: {STATUS_LABELS[report.status]}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-text-muted">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>
                    Assigned: <strong className="text-text-primary">{DEPARTMENT_LABELS[report.routedTo]}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>
                    Reported on:{' '}
                    <strong className="text-text-primary">
                      {new Date(report.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </strong>
                  </span>
                </div>
                {report.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>
                      Location: <strong className="text-text-primary">{report.location}</strong>
                    </span>
                  </div>
                )}
                {report.incidentDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>
                      Incident Date: <strong className="text-text-primary">{report.incidentDate}</strong>
                    </span>
                  </div>
                )}
                {report.evidenceUrls && report.evidenceUrls.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60 text-xs">
                    <span className="text-text-muted flex items-center gap-1 font-medium">
                      <Paperclip className="w-3.5 h-3.5 text-primary" /> Attached Evidence:
                    </span>
                    {report.evidenceUrls.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-md bg-surface-tint hover:bg-primary/10 text-primary text-[11px] font-medium border border-border/80 inline-flex items-center gap-1"
                      >
                        Evidence #{i + 1}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Protective Reassurance Banner */}
              <div className="mt-4 p-3 bg-primary-50/70 border border-primary/20 rounded-xl flex items-start gap-2.5 text-xs text-primary-900">
                <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p>
                  <strong>Confidentiality Guaranteed:</strong> Your communication is protected under GLBITM
                  BOG Grievance Policy §1.2.7 against retaliation. The committee cannot see your name or
                  identity.
                </p>
              </div>
            </Card>

            {/* Direct Two-Way Anonymous Chat Section */}
            <Card padding="lg" className="flex flex-col min-h-[480px]">
              <div className="pb-4 mb-4 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-text-primary">
                    Direct Confidential Chat
                  </h2>
                  <p className="text-xs text-text-muted">
                    Communicate anonymously with members of {DEPARTMENT_LABELS[report.routedTo]}.
                  </p>
                </div>
                <span className="text-[11px] bg-surface px-2.5 py-1 rounded-full border border-border text-text-muted">
                  Live Thread
                </span>
              </div>

              {/* Chat Thread Messages */}
              <div className="flex-1 overflow-y-auto mb-4 pr-1">
                <ChatThread messages={messages} department={report.routedTo} />
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="pt-3 border-t border-border">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder="Type a confidential message for the committee…"
                    disabled={isSending}
                    className="flex-1 bg-surface-tint border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                  <Button type="submit" disabled={isSending || !newMessageText.trim()}>
                    {isSending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-1.5" />
                        Send
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-[11px] text-text-muted mt-2">
                  Tip: For your safety, do not write your name, phone number, or student roll number.
                </p>
              </form>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
