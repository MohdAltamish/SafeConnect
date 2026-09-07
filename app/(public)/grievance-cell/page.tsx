import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Shield,
  Users,
  Clock,
  Mail,
  ExternalLink,
  FileText,
  AlertCircle,
  CheckCircle2,
  Lock,
  Building2,
  Calendar,
  GraduationCap,
  HeartHandshake,
} from 'lucide-react';
import {
  GLBITM_INFO,
  IC_MEMBERS,
  SEXUAL_HARASSMENT_DEFINITION,
  POLICY_TIMELINES,
  POLICY_PROTECTIONS,
} from '@/lib/constants/glbitm';

export const metadata = {
  title: "Women Grievance Cell & Internal Committee (IC) — GLBITM | SafeConnect",
  description:
    "Official information, committee directory, AICTE regulations mandate, and grievance redressal procedure for GLBITM Internal Complaint Committee (IC).",
};

export default function GrievanceCellPage() {
  const presidingOfficer = IC_MEMBERS.find((m) => m.category === 'Presiding Officer');
  const facultyMembers = IC_MEMBERS.filter((m) => m.category === 'Faculty Member');
  const nonTeachingMembers = IC_MEMBERS.filter((m) => m.category === 'Non-Teaching Member');
  const studentMembers = IC_MEMBERS.filter((m) => m.category === 'Student Member');
  const ngoMember = IC_MEMBERS.find((m) => m.category === 'Member (NGO)');

  return (
    <>
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 py-10 max-w-[1000px] w-full mx-auto">
        {/* Header Badge & Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <Building2 className="w-3.5 h-3.5" />
            <span>{GLBITM_INFO.institutionName}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-text-primary mb-3">
            Internal Committee (IC) / Women Grievance Cell
          </h1>

          <p className="text-sm sm:text-base text-text-muted max-w-2xl mx-auto leading-relaxed">
            Reconstituted for the prevention, prohibition, and redressal of sexual harassment
            against women at the workplace as per AICTE Regulations, 2016 vide No.{' '}
            <strong className="text-text-primary font-medium">F.AICTE/WH/2016/01</strong> dated 10th June, 2016.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <Link href="/report">
              <Button size="md" className="shadow-sm">
                <Shield className="w-4 h-4 mr-2" />
                Report Anonymously via SafeConnect
              </Button>
            </Link>
            <a
              href={GLBITM_INFO.onlinePortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <Button variant="secondary" size="md">
                <ExternalLink className="w-4 h-4 mr-2" />
                Online Grievance System
              </Button>
            </a>
            <Link href="/grievance-policy">
              <Button variant="ghost" size="md">
                <FileText className="w-4 h-4 mr-2" />
                Grievance Policy
              </Button>
            </Link>
          </div>
        </div>

        {/* Mandate & Scope Banner */}
        <div className="bg-surface-tint border border-border rounded-2xl p-5 sm:p-6 mb-10 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <HeartHandshake className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-base sm:text-lg font-semibold text-text-primary mb-1">
                Mandate & Objective
              </h2>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-3">
                The Internal Committee (IC) takes care of all complaints on sexual harassment of girl
                students, female faculty, and non-teaching staff at the workplace and initiates prompt
                action for redressal. The cell ensures a neutral, confidential, and supportive
                environment fostering a campus that is safe and respectful for all.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-text-primary">
                <div className="flex items-center gap-2 bg-surface p-2.5 rounded-lg border border-border/80">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>
                    Official Contact:{' '}
                    <a
                      href={`mailto:${GLBITM_INFO.email}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {GLBITM_INFO.email}
                    </a>
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-surface p-2.5 rounded-lg border border-border/80">
                  <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>
                    Schedule:{' '}
                    <strong className="font-medium text-text-primary">
                      {GLBITM_INFO.meetingSchedule}
                    </strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Committee Directory */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
                Internal Committee Members
              </h2>
              <p className="text-xs sm:text-sm text-text-muted">
                Statutory composition with presiding officer, faculty, non-teaching staff, student nominees, and external NGO representation.
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold">
              9 Active Members
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Presiding Officer */}
            {presidingOfficer && (
              <Card
                padding="md"
                className="md:col-span-2 border-2 border-primary/30 bg-primary/5 hover:border-primary/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div>
                      <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-primary mb-0.5">
                        {presidingOfficer.designationCommittee}
                      </span>
                      <h3 className="text-base font-bold text-text-primary">
                        {presidingOfficer.name}
                      </h3>
                      <p className="text-xs text-text-muted">
                        {presidingOfficer.designationOrg}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex self-start sm:self-auto items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary text-white">
                    Head of Committee
                  </span>
                </div>
              </Card>
            )}

            {/* Faculty Members */}
            {facultyMembers.map((member) => (
              <Card key={member.sNo} padding="md" className="hover:border-primary/40 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-semibold text-xs flex-shrink-0 mt-0.5">
                    {member.sNo}
                  </div>
                  <div className="flex-1">
                    <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider block mb-0.5">
                      {member.designationCommittee}
                    </span>
                    <h3 className="text-sm font-bold text-text-primary">{member.name}</h3>
                    <p className="text-xs text-text-muted mt-0.5">{member.designationOrg}</p>
                  </div>
                </div>
              </Card>
            ))}

            {/* Non-Teaching Members */}
            {nonTeachingMembers.map((member) => (
              <Card key={member.sNo} padding="md" className="hover:border-primary/40 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral/10 text-neutral flex items-center justify-center font-semibold text-xs flex-shrink-0 mt-0.5">
                    {member.sNo}
                  </div>
                  <div className="flex-1">
                    <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-0.5">
                      {member.designationCommittee}
                    </span>
                    <h3 className="text-sm font-bold text-text-primary">{member.name}</h3>
                    <p className="text-xs text-text-muted mt-0.5">{member.designationOrg}</p>
                  </div>
                </div>
              </Card>
            ))}

            {/* Student Members */}
            {studentMembers.map((member) => (
              <Card
                key={member.sNo}
                padding="md"
                className="bg-surface-tint/60 border-border/80 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-warning/15 text-warning flex items-center justify-center font-semibold text-xs flex-shrink-0 mt-0.5">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-warning uppercase tracking-wider block mb-0.5">
                        {member.designationCommittee}
                      </span>
                      <span className="text-[10px] font-mono text-text-muted bg-surface px-1.5 py-0.5 rounded border border-border">
                        Roll: {member.rollNumber}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-text-primary">{member.name}</h3>
                    <p className="text-xs text-text-muted mt-0.5">{member.designationOrg}</p>
                  </div>
                </div>
              </Card>
            ))}

            {/* NGO Member */}
            {ngoMember && (
              <Card
                padding="md"
                className="md:col-span-2 bg-success/5 border-success/30 hover:border-success/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-success/20 text-success flex items-center justify-center font-semibold text-xs flex-shrink-0 mt-0.5">
                    9
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-success uppercase tracking-wider block mb-0.5">
                        External Representative · {ngoMember.designationCommittee}
                      </span>
                      <h3 className="text-sm font-bold text-text-primary">{ngoMember.name}</h3>
                      <p className="text-xs text-text-muted mt-0.5">{ngoMember.designationOrg}</p>
                    </div>
                    <span className="inline-flex self-start sm:self-auto items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success/15 text-success">
                      NGO Representative ({ngoMember.organization})
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </section>

        {/* Definition of Sexual Harassment */}
        <section className="mb-12">
          <Card padding="lg" className="border-border bg-surface">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-danger/10 text-danger flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-primary">
                  What is Sexual Harassment?
                </h2>
                <p className="text-xs text-text-muted">
                  According to the Supreme Court Order & Policy §1.2.4, sexual harassment includes any of the following unwelcome conduct:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {SEXUAL_HARASSMENT_DEFINITION.map((clause, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-surface-tint border border-border/80 text-xs text-text-primary"
                >
                  <span className="w-5 h-5 rounded-full bg-danger/10 text-danger flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{clause}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Grievance Redressal Mechanism & Timelines */}
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-2">
            Grievance Redressal Process & Timelines
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mb-6">
            Strict procedural deadlines and safeguards established under GLBITM Grievance Policy.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card padding="md" className="border-border">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Clock className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wide">Step 1</span>
              </div>
              <h3 className="text-sm font-bold text-text-primary mb-1">
                Convene within 1 Week
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                {POLICY_TIMELINES.meetingConvened}. The committee initiates proceedings expeditiously.
              </p>
            </Card>

            <Card padding="md" className="border-border">
              <div className="flex items-center gap-2 text-secondary mb-2">
                <Users className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wide">Step 2</span>
              </div>
              <h3 className="text-sm font-bold text-text-primary mb-1">
                Quorum & Recusal
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                {POLICY_TIMELINES.quorum}. {POLICY_TIMELINES.recusalRule}
              </p>
            </Card>

            <Card padding="md" className="border-border">
              <div className="flex items-center gap-2 text-success mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wide">Step 3</span>
              </div>
              <h3 className="text-sm font-bold text-text-primary mb-1">
                Action within 14 Days
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                {POLICY_TIMELINES.recommendations} for immediate and appropriate corrective measures.
              </p>
            </Card>
          </div>

          {/* Guarantees & Protections */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card padding="md" className="bg-primary/5 border-primary/20">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-text-primary mb-1">
                    Anonymity Guaranteed (Policy §1.1.1)
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {POLICY_PROTECTIONS.anonymity} SafeConnect provides mathematical zero-knowledge proof — no names, IPs, or devices are ever logged.
                  </p>
                </div>
              </div>
            </Card>

            <Card padding="md" className="bg-success/5 border-success/20">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-text-primary mb-1">
                    Protection Against Victimization (Policy §1.2.7)
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {POLICY_PROTECTIONS.protectionAgainstVictimization}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* External Resources & Official Links */}
        <section className="border-t border-border pt-8 mt-12 text-center">
          <h3 className="text-base font-bold text-text-primary mb-2">
            Official Institution Resources
          </h3>
          <p className="text-xs text-text-muted mb-6 max-w-md mx-auto">
            {GLBITM_INFO.address} · Managed by {GLBITM_INFO.managedBy} · Affiliated to {GLBITM_INFO.affiliatedTo}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={GLBITM_INFO.onlinePortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Online Grievance Redressal Portal
            </a>
            <span className="text-border">•</span>
            <a
              href={GLBITM_INFO.policyPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
            >
              <FileText className="w-3.5 h-3.5" />
              Official Grievance Policy (PDF)
            </a>
            <span className="text-border">•</span>
            <a
              href={`mailto:${GLBITM_INFO.email}`}
              className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
            >
              <Mail className="w-3.5 h-3.5" />
              wgc@glbitm.ac.in
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
