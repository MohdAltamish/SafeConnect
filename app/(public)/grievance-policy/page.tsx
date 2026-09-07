import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  FileText,
  ExternalLink,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Users,
  Building2,
  Clock,
  BookOpen,
  Mail,
} from 'lucide-react';
import {
  GLBITM_INFO,
  STATUTORY_COMMITTEES,
  POLICY_TIMELINES,
  POLICY_PROTECTIONS,
  SEXUAL_HARASSMENT_DEFINITION,
  OTHER_GLBITM_CELLS,
} from '@/lib/constants/glbitm';

export const metadata = {
  title: 'GLBITM Grievance Policy — SafeConnect',
  description:
    'Complete policy document and redressal mechanism of G.L. Bajaj Institute of Technology & Management (Approved in 20th BOG meeting).',
};

export default function GrievancePolicyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 py-10 max-w-[960px] w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-semibold mb-4">
            <Building2 className="w-3.5 h-3.5" />
            <span>{GLBITM_INFO.institutionName}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-text-primary mb-3">
            Institutional Grievance Policy
          </h1>

          <p className="text-sm sm:text-base text-text-muted max-w-2xl mx-auto leading-relaxed">
            {GLBITM_INFO.bogApproval}. Overseen by Rajiv Memorial Academic Welfare Society,
            approved by AICTE, and affiliated to Dr. A.P.J. Abdul Kalam Technical University (AKTU).
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <a
              href={GLBITM_INFO.policyPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <Button size="md">
                <FileText className="w-4 h-4 mr-2" />
                View Original Policy PDF
                <ExternalLink className="w-3.5 h-3.5 ml-1.5 opacity-70" />
              </Button>
            </a>
            <a
              href={GLBITM_INFO.onlinePortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <Button variant="secondary" size="md">
                <ExternalLink className="w-4 h-4 mr-2" />
                Online Grievance System (SIM)
              </Button>
            </a>
            <Link href="/grievance-cell">
              <Button variant="ghost" size="md">
                <Users className="w-4 h-4 mr-2" />
                Internal Committee Members
              </Button>
            </Link>
          </div>
        </div>

        {/* Section 1: Grievance Redressal Mechanism */}
        <section className="mb-10">
          <Card padding="lg" className="border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                §1.1
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-primary">
                  Grievance Redressal Mechanism (GRM)
                </h2>
                <p className="text-xs text-text-muted">
                  Managing and governing resolution of grievances raised by students, faculty, and staff.
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-4">
              The institute has a clearly defined policy for addressing grievances to provide redressal for any type of complaint. The Grievance Redressal Committee (GRC) oversees the formation of statutory committees:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {STATUTORY_COMMITTEES.map((comm, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-surface-tint border border-border">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">
                    {comm.clause}
                  </span>
                  <h3 className="text-xs font-bold text-text-primary mb-1">{comm.name}</h3>
                  <p className="text-[11px] text-text-muted leading-relaxed">{comm.description}</p>
                </div>
              ))}
            </div>

            {/* Evaluation Parameters */}
            <div className="bg-surface p-4 rounded-xl border border-border/80 text-xs text-text-primary">
              <h4 className="font-semibold text-text-primary mb-2 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-secondary" />
                Evaluation Parameters for Efficacy of GRM:
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-text-muted">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />
                  The number of cases received & types
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />
                  Duration of time taken for corrective action
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />
                  Instances where escalations were deemed necessary
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />
                  Recurrence of grievances & confirmation frequency
                </li>
              </ul>
            </div>
          </Card>
        </section>

        {/* Section 2: Core Policy Guarantees */}
        <section className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card padding="md" className="bg-primary/5 border-primary/25">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-text-primary mb-1">
                  Guaranteed Anonymity (§1.1.1)
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  {POLICY_PROTECTIONS.anonymity}
                </p>
                <p className="text-[11px] text-text-muted mt-2">
                  Complainants can register input via SIM, feedback forms, electronic mail (wgc@glbitm.ac.in), or directly through SafeConnect without revealing identity.
                </p>
              </div>
            </div>
          </Card>

          <Card padding="md" className="bg-success/5 border-success/25">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-text-primary mb-1">
                  Protection Against Victimization (§1.2.7)
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  {POLICY_PROTECTIONS.protectionAgainstVictimization}
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 3: Statutory Timelines & Procedure */}
        <section className="mb-10">
          <Card padding="lg" className="border-border">
            <h2 className="text-lg font-bold text-text-primary mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-secondary" />
              Procedure & Timelines (§1.1.5)
            </h2>
            <p className="text-xs text-text-muted mb-6">
              Mandatory procedural requirements for all grievance meetings and investigations:
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-tint border border-border">
                <span className="w-7 h-7 rounded-lg bg-secondary/15 text-secondary font-bold text-xs flex items-center justify-center flex-shrink-0">
                  1W
                </span>
                <div>
                  <h4 className="text-xs font-bold text-text-primary">
                    1-Week Meeting Mandate
                  </h4>
                  <p className="text-xs text-text-muted">
                    {POLICY_TIMELINES.meetingConvened} to assess evidence and schedule formal proceedings.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-tint border border-border">
                <span className="w-7 h-7 rounded-lg bg-secondary/15 text-secondary font-bold text-xs flex items-center justify-center flex-shrink-0">
                  14D
                </span>
                <div>
                  <h4 className="text-xs font-bold text-text-primary">
                    Recommendations within 1 Fortnight
                  </h4>
                  <p className="text-xs text-text-muted">
                    {POLICY_TIMELINES.recommendations} for prompt administrative and corrective action.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-tint border border-border">
                <span className="w-7 h-7 rounded-lg bg-secondary/15 text-secondary font-bold text-xs flex items-center justify-center flex-shrink-0">
                  3M
                </span>
                <div>
                  <h4 className="text-xs font-bold text-text-primary">
                    Quorum & Conflict Recusal Rule
                  </h4>
                  <p className="text-xs text-text-muted">
                    {POLICY_TIMELINES.quorum}. {POLICY_TIMELINES.recusalRule}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-tint border border-border">
                <span className="w-7 h-7 rounded-lg bg-secondary/15 text-secondary font-bold text-xs flex items-center justify-center flex-shrink-0">
                  REP
                </span>
                <div>
                  <h4 className="text-xs font-bold text-text-primary">
                    Right to Representation & Calm Setting (§1.1.2 & §1.2.6)
                  </h4>
                  <p className="text-xs text-text-muted">
                    The individual is afforded a just and equitable chance to be presented before the chairperson and members in a calm and conciliatory setting. If the complainant desires, they may be accompanied by a representative.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 4: What is Sexual Harassment (§1.2.4) */}
        <section className="mb-10">
          <Card padding="lg" className="border-border">
            <h2 className="text-lg font-bold text-text-primary mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-danger" />
              Prohibited Conduct: Sexual Harassment (§1.2.4)
            </h2>
            <p className="text-xs text-text-muted mb-4">
              Per the Supreme Court Order and Section 1.2.4 of the GLBITM Policy, sexual harassment includes any unwelcome:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-text-primary">
              {SEXUAL_HARASSMENT_DEFINITION.map((clause, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2.5 rounded-lg bg-surface-tint border border-border"
                >
                  <span className="text-primary font-bold">•</span>
                  <span>{clause}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Section 5: Other Institutional Grievance Redressal Cells (Reference Directory) */}
        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-text-primary mb-1">
              Other Institutional Grievance Cells (Reference Directory)
            </h2>
            <p className="text-xs text-text-muted leading-relaxed">
              SafeConnect is specifically designed as an anonymous, confidential reporting shield for{' '}
              <strong className="text-text-primary font-medium">Women / Internal Committee (IC)</strong> cases under AICTE 2016 regulations. For other academic, faculty, or community matters, GLBITM maintains the following dedicated committees:
            </p>
          </div>

          <div className="space-y-4">
            {OTHER_GLBITM_CELLS.map((cell, idx) => (
              <Card key={idx} padding="md" className="border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-border/80">
                  <div>
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                      {cell.clause} · {cell.shortName}
                    </span>
                    <h3 className="text-sm font-bold text-text-primary mt-0.5">
                      {cell.name}
                    </h3>
                  </div>
                  <a
                    href={`mailto:${cell.email}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-tint border border-border text-xs font-semibold text-primary hover:bg-primary/5 transition-colors self-start sm:self-auto"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{cell.email}</span>
                  </a>
                </div>

                <p className="text-xs text-text-muted mb-3 leading-relaxed">
                  {cell.description}
                </p>

                {/* Members list */}
                <div className="bg-surface-tint/60 rounded-xl p-3 border border-border/70">
                  <h4 className="text-[11px] font-bold text-text-primary uppercase tracking-wider mb-2">
                    Committee Composition ({cell.members.length} Members)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {cell.members.map((m) => (
                      <div
                        key={m.sNo}
                        className="flex items-start gap-2 bg-surface p-2 rounded-lg border border-border/60"
                      >
                        <span className="w-4 h-4 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {m.sNo}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <strong className="text-[12px] font-semibold text-text-primary truncate">
                              {m.name}
                            </strong>
                            <span className="text-[10px] text-secondary font-medium uppercase px-1.5 py-0.2 bg-secondary/5 rounded border border-secondary/20 flex-shrink-0">
                              {m.position}
                            </span>
                          </div>
                          <p className="text-[11px] text-text-muted truncate">
                            {m.designation}
                            {m.rollNumber && ` (Roll: ${m.rollNumber})`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}

            {/* Anti-Ragging Committee Note */}
            <Card padding="md" className="border-border bg-surface-tint/40">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                Policy §1.3.1 · Anti-Ragging Committee
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Oversees and advises the campus community to preserve a culture strictly devoid of ragging. Routinely inspects hostels, buses, canteens, and classrooms. Reports of ragging can be submitted anonymously through SafeConnect or via the National Helpline (1800-180-5522).
              </p>
            </Card>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="bg-surface-tint border border-border rounded-2xl p-6 text-center">
          <h3 className="text-base font-bold text-text-primary mb-2">
            Need to submit a report confidentially?
          </h3>
          <p className="text-xs text-text-muted max-w-md mx-auto mb-4">
            SafeConnect enables zero-knowledge anonymous incident submissions directly to GLBITM statutory authorities.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/report">
              <Button size="md">
                <Shield className="w-4 h-4 mr-2" />
                Submit Anonymous Report
              </Button>
            </Link>
            <Link href="/grievance-cell">
              <Button variant="secondary" size="md">
                <BookOpen className="w-4 h-4 mr-2" />
                View IC Committee
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
