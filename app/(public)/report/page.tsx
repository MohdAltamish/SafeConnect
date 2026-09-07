import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { ReportForm } from '@/components/report/ReportForm';

export const metadata = {
  title: 'Report an Incident — SafeConnect',
  description: 'Submit an anonymous report directly to your college authority. No login, no identity collected.',
};

/**
 * Report page per Design.md §7:
 * Multi-step form, progress indicator at top, back/next navigation.
 * Per Rules.md §1: No analytics, no cookies, no PII collection.
 */
export default function ReportPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-[640px]">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
              Report an Incident
            </h1>
            <p className="text-sm text-text-muted">
              Your identity is never collected. Take your time — nothing is submitted until
              you choose to.
            </p>
          </div>

          <ReportForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
