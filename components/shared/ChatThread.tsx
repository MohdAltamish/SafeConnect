'use client';

import React from 'react';
import { type Message, SENDER_ROLE, type Department, DEPARTMENT_LABELS } from '@/types';

interface ChatThreadProps {
  messages: Message[];
  department?: Department;
}

/**
 * Chat thread per Design.md §5:
 * Student messages left-aligned, muted background;
 * authority messages right-aligned, berry background, white text.
 * Label is always "Student" or the department name — never a real name.
 */
export function ChatThread({ messages, department }: ChatThreadProps) {
  if (messages.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-text-muted">No messages yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {messages.map((msg) => {
        const isStudent = msg.senderRole === SENDER_ROLE.STUDENT;
        return (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[80%] ${
              isStudent ? 'self-start' : 'self-end'
            }`}
          >
            <span className="text-[11px] text-text-muted mb-1 px-1">
              {isStudent ? 'Student' : department ? DEPARTMENT_LABELS[department] : 'Authority'}
            </span>
            <div
              className={`rounded-2xl px-4 py-3 text-sm ${
                isStudent
                  ? 'bg-surface-tint text-text-primary rounded-tl-sm'
                  : 'bg-primary text-white rounded-tr-sm'
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[10px] text-text-muted mt-1 px-1">
              {new Date(msg.createdAt).toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        );
      })}
    </div>
  );
}
