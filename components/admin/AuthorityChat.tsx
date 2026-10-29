'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ChatThread } from '@/components/shared/ChatThread';
import { type Message, type Department } from '@/types';
import { Send, MessageSquare, Sparkles, Loader2 } from 'lucide-react';

const CANNED_TEMPLATES = [
  'Thank you for reaching out. To assist our inquiry, could you share whether this occurred during daytime classes or evening hours?',
  'The committee has convened a preliminary review of your grievance. Please know campus counseling and student support are available at Room 102.',
  'Preliminary precautionary measures have been deployed in the reported area. We will keep you updated on progress here in this thread.',
  'Could you clarify the general physical location within the campus block where this occurred?',
];

interface AuthorityChatProps {
  caseId: string;
  department: Department;
  initialMessages?: Message[];
}

export function AuthorityChat({
  caseId,
  department,
  initialMessages = [],
}: AuthorityChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    setIsSending(true);
    setError(null);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId,
          text,
          senderRole: 'authority',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setMessages((prev) => [
        ...prev,
        {
          id: data.id || `msg-${Date.now()}`,
          senderRole: 'authority',
          text,
          createdAt: new Date().toISOString(),
        },
      ]);
      setInputText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error sending message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-text-primary">
            Anonymous Two-Way Communication
          </h3>
        </div>
        <span className="text-[11px] text-text-muted">
          Complainant Identity: <strong className="text-text-primary">Zero-Knowledge Protected</strong>
        </span>
      </div>

      {/* Messages Thread */}
      <div className="max-h-[350px] overflow-y-auto pr-1 py-2">
        <ChatThread messages={messages} department={department} />
      </div>

      {error && (
        <p className="text-xs text-error">{error}</p>
      )}

      {/* Canned Templates */}
      <div className="space-y-1.5 pt-2 border-t border-border">
        <span className="text-[11px] font-medium text-text-muted flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-primary" /> Trauma-Informed Templates (Click to insert):
        </span>
        <div className="flex flex-wrap gap-1.5">
          {CANNED_TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setInputText(tmpl)}
              className="text-[11px] text-left px-2.5 py-1 rounded-md bg-surface-tint border border-border/70 hover:border-primary text-text-secondary transition-colors"
            >
              {tmpl.length > 55 ? tmpl.slice(0, 55) + '…' : tmpl}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="flex gap-2">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type an official message to the student (never request names or roll numbers)..."
          rows={2}
          className="flex-1 text-xs rounded-lg border border-border bg-surface p-2.5 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <Button
          type="button"
          size="sm"
          disabled={isSending || !inputText.trim()}
          onClick={() => handleSend()}
          className="self-end px-3 py-2.5"
        >
          {isSending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
