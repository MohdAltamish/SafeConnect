'use client';

import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

/**
 * Case detail view (student side) per Design.md §7:
 * Status badge at top, chat thread below, message input at bottom.
 * No case metadata beyond what she submitted herself.
 *
 * Placeholder for Phase 3 (FR5, FR6).
 */
export default function CaseDetailPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-[640px]">
          <Card padding="lg">
            <div className="text-center py-8">
              <Badge status="NEW" className="mb-4" />
              <h2 className="text-lg font-semibold text-text-primary mb-2">
                Case Detail View
              </h2>
              <p className="text-sm text-text-muted">
                Status tracking and anonymous chat will be available in Phase 3.
              </p>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
