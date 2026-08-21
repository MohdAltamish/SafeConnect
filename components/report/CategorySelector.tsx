'use client';

import React from 'react';
import { REPORT_CATEGORY, CATEGORY_LABELS, type ReportCategory } from '@/types';
import { Shield, Users, AlertTriangle, Eye, Monitor, Home, HelpCircle } from 'lucide-react';

interface CategorySelectorProps {
  value: ReportCategory | null;
  onChange: (category: ReportCategory) => void;
  error?: string;
}

const CATEGORY_ICONS: Record<ReportCategory, React.ReactNode> = {
  SEXUAL_HARASSMENT: <Shield className="w-5 h-5" />,
  BULLYING: <Users className="w-5 h-5" />,
  RAGGING: <AlertTriangle className="w-5 h-5" />,
  STALKING: <Eye className="w-5 h-5" />,
  CYBERBULLYING: <Monitor className="w-5 h-5" />,
  HOSTEL_ISSUE: <Home className="w-5 h-5" />,
  OTHER: <HelpCircle className="w-5 h-5" />,
};

/**
 * Card-style radio group for category selection per Design.md §5:
 * "Card-style radio group (tap a card, not a dropdown) — more discreet
 * and faster on mobile than a <select>"
 */
export function CategorySelector({ value, onChange, error }: CategorySelectorProps) {
  const categories = Object.values(REPORT_CATEGORY);

  return (
    <fieldset>
      <legend className="text-sm font-medium text-text-primary mb-3">
        What kind of incident are you reporting?
      </legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup">
        {categories.map((category) => {
          const isSelected = value === category;
          return (
            <button
              key={category}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(category)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 min-h-[56px]
                ${
                  isSelected
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border bg-surface text-text-primary hover:border-primary/40 hover:bg-surface-tint'
                }
                focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2
              `}
            >
              <span className={isSelected ? 'text-primary' : 'text-text-muted'}>
                {CATEGORY_ICONS[category]}
              </span>
              <span className="text-[15px] font-medium">
                {CATEGORY_LABELS[category]}
              </span>
            </button>
          );
        })}
      </div>
      {error && (
        <p className="mt-2 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
