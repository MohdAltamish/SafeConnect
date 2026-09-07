import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Button } from '@/components/ui/Button';
import { Shield, Search, Lock, Eye } from 'lucide-react';

/**
 * Landing page per Design.md §7:
 * Short, reassuring headline, one primary CTA, a secondary link,
 * and 2-3 lines explaining anonymity is guaranteed by design.
 *
 * Per Design.md §1: Calm, not alarming. Discreet. Trustworthy. Mobile-first.
 */
export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-16">
        <div className="max-w-[640px] w-full text-center">
          {/* Hero */}
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4 leading-tight">
            Report safely.{' '}
            <span className="text-primary">Stay anonymous.</span>{' '}
            Always.
          </h1>

          <p className="text-text-muted text-base sm:text-lg mb-10 max-w-md mx-auto leading-relaxed">
            Your identity is never collected — not even by us. Report an incident directly
            to the right college authority, instantly and anonymously.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <Link href="/report" className="w-full sm:w-auto">
              <Button size="lg" fullWidth className="sm:w-auto sm:min-w-[220px]">
                Report an Incident
              </Button>
            </Link>
            <Link href="/track" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" fullWidth className="sm:w-auto sm:min-w-[220px]">
                <Search className="w-4 h-4 mr-2" />
                Track an Existing Report
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left mb-16">
            <div className="flex flex-col items-center text-center gap-2 p-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-1">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-text-primary">No login required</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                No sign-up, no email, no phone number. Just describe what happened.
              </p>
            </div>

            <div className="flex flex-col items-center text-center gap-2 p-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-1">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-text-primary">Zero data collected</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                We don&apos;t store your name, IP address, device info, or any identifying data.
              </p>
            </div>

            <div className="flex flex-col items-center text-center gap-2 p-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-1">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-text-primary">Directly routed</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Your report goes straight to the relevant authority — no middlemen, no delays.
              </p>
            </div>
          </div>

          {/* GLBITM Grievance Cell & Policy Feature Card */}
          <div className="bg-surface-tint border border-border rounded-2xl p-6 text-left shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-border">
              <div>
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider block mb-0.5">
                  Institutional Governance
                </span>
                <h2 className="text-base font-bold text-text-primary">
                  GLBITM Internal Committee (IC) & Grievance Policy
                </h2>
              </div>
              <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary self-start sm:self-auto">
                AICTE Reg. 2016 Compliant
              </span>
            </div>

            <p className="text-xs text-text-muted leading-relaxed mb-4">
              Formed for the prevention, prohibition, and redressal of sexual harassment against women
              at the workplace as per AICTE Regulations (F.AICTE/WH/2016/01). Presided over by{' '}
              <strong className="text-text-primary">Dr. Rashmi Mishra</strong> with faculty, non-teaching,
              student, and external NGO (<strong className="text-text-primary">Katalyst, Delhi</strong>) representatives.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-text-primary mb-5">
              <div className="flex items-center gap-2 p-2 bg-surface rounded-lg border border-border/70">
                <span className="w-2 h-2 rounded-full bg-success flex-shrink-0" />
                <span>Zero retaliation guaranteed (Policy §1.2.7)</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-surface rounded-lg border border-border/70">
                <span className="w-2 h-2 rounded-full bg-secondary flex-shrink-0" />
                <span>Formal meeting convened within 1 week</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <Link
                href="/grievance-cell"
                className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
              >
                View Committee Members →
              </Link>
              <span className="text-border">•</span>
              <Link
                href="/grievance-policy"
                className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
              >
                Read Grievance Policy →
              </Link>
              <span className="text-border">•</span>
              <a
                href="https://tinyurl.com/5cpu863a"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-primary transition-colors"
              >
                Official SIM Portal ↗
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
