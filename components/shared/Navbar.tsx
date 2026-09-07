'use client';

import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

interface NavbarProps {
  variant?: 'public' | 'admin';
}

/**
 * Navbar — per Design.md §6: a single shield icon as brand mark,
 * small and unobtrusive.
 */
export function Navbar({ variant = 'public' }: NavbarProps) {
  return (
    <nav className="w-full border-b border-border bg-surface/90 backdrop-blur-sm sticky top-0 z-50">
      <div className={`mx-auto px-4 sm:px-6 h-14 flex items-center justify-between ${
        variant === 'admin' ? 'max-w-[1280px]' : 'max-w-[1000px]'
      }`}>
        <Link
          href={variant === 'admin' ? '/admin/dashboard' : '/'}
          className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors flex-shrink-0"
        >
          <Shield className="w-5 h-5" />
          <span className="font-semibold text-[15px]">SafeConnect</span>
          {variant === 'public' && (
            <span className="hidden md:inline-block text-[11px] font-medium px-2 py-0.5 rounded bg-primary/10 text-primary ml-1">
              GLBITM
            </span>
          )}
        </Link>

        {variant === 'public' && (
          <div className="flex items-center gap-3 sm:gap-5 text-xs sm:text-sm">
            <Link
              href="/grievance-cell"
              className="text-text-muted hover:text-primary transition-colors font-medium"
            >
              <span className="hidden sm:inline">Women Grievance Cell (IC)</span>
              <span className="sm:hidden">IC Cell</span>
            </Link>
            <Link
              href="/grievance-policy"
              className="text-text-muted hover:text-primary transition-colors font-medium"
            >
              Policy
            </Link>
            <Link
              href="/track"
              className="text-text-muted hover:text-primary transition-colors font-medium"
            >
              Track Report
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
