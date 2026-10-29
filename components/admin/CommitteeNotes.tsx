'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { type CommitteeNote } from '@/types';
import { FileText, Plus, ShieldCheck, Loader2 } from 'lucide-react';

interface CommitteeNotesProps {
  caseId: string;
  initialNotes?: CommitteeNote[];
}

export function CommitteeNotes({
  caseId,
  initialNotes = [],
}: CommitteeNotesProps) {
  const [notes, setNotes] = useState<CommitteeNote[]>(initialNotes);
  const [noteText, setNoteText] = useState('');
  const [isFormalMinute, setIsFormalMinute] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/cases/${caseId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteText: noteText.trim(),
          isFormalMinute,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save note');
      }

      setNotes((prev) => [data.note, ...prev]);
      setNoteText('');
      setIsFormalMinute(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding note');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-text-primary">
            Confidential Committee Minutes & Internal Notes
          </h3>
        </div>
        <span className="flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full font-medium">
          <ShieldCheck className="w-3 h-3" /> Hidden From Student
        </span>
      </div>

      {/* Add note form */}
      <form onSubmit={handleAddNote} className="space-y-2">
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Record confidential committee observations, hearing testimony, or official minutes..."
          rows={3}
          className="w-full text-xs rounded-lg border border-border bg-surface p-2.5 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={isFormalMinute}
              onChange={(e) => setIsFormalMinute(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary"
            />
            <span>Mark as Formal Statutory Minute of Meeting</span>
          </label>

          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting || !noteText.trim()}
            className="flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            Save Entry
          </Button>
        </div>
      </form>

      {error && <p className="text-xs text-error">{error}</p>}

      {/* Notes List */}
      <div className="space-y-2 pt-2 max-h-60 overflow-y-auto pr-1">
        {notes.length === 0 ? (
          <p className="text-xs text-text-muted text-center py-4">
            No internal committee notes recorded yet.
          </p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className={`p-3 rounded-xl border text-xs space-y-1 ${
                note.isFormalMinute
                  ? 'border-primary/40 bg-primary/5'
                  : 'border-border bg-surface-tint/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-text-primary">
                  {note.authorName}
                </span>
                <div className="flex items-center gap-2">
                  {note.isFormalMinute && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary text-white">
                      Official Minute
                    </span>
                  )}
                  <span className="text-[10px] text-text-muted">
                    {new Date(note.createdAt).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
              <p className="text-text-secondary whitespace-pre-wrap">{note.noteText}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
