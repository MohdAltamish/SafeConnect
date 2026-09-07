import React from 'react';
import Link from 'next/link';
import { ExternalLink, Mail, Shield } from 'lucide-react';
import { GLBITM_INFO } from '@/lib/constants/glbitm';

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-surface-tint/50 py-8 mt-auto">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-border/60 text-xs">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Shield className="w-4 h-4" />
            <span>SafeConnect · {GLBITM_INFO.shortName}</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-text-muted">
            <Link
              href="/grievance-cell"
              className="hover:text-primary transition-colors"
            >
              Women Grievance Cell (IC)
            </Link>
            <Link
              href="/grievance-policy"
              className="hover:text-primary transition-colors"
            >
              Grievance Policy
            </Link>
            <a
              href={GLBITM_INFO.onlinePortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-primary transition-colors"
            >
              SIM Portal <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={`mailto:${GLBITM_INFO.email}`}
              className="inline-flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Mail className="w-3 h-3" />
              {GLBITM_INFO.email}
            </a>
          </nav>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-text-muted text-center sm:text-left">
          <p>
            {GLBITM_INFO.institutionName}, Greater Noida · Approved by AICTE · Affiliated to Dr. A.P.J. AKTU
          </p>
          <p>
            SafeConnect guarantees 100% cryptographic anonymity.
          </p>
        </div>
      </div>
    </footer>
  );
}
