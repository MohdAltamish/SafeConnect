import { Card } from '@/components/ui/Card';

export const metadata = {
  title: 'Analytics — SafeConnect Admin',
};

/**
 * Superadmin analytics page per Design.md §7 / PRD.md FR9:
 * Aggregate-only counts — no individual case content.
 * Placeholder for Phase 6.
 */
export default function AdminAnalyticsPage() {
  return (
    <main className="min-h-screen bg-surface-tint">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-text-primary mb-6">Analytics</h1>
        <Card padding="lg">
          <p className="text-sm text-text-muted text-center py-8">
            Analytics dashboard will be implemented in Phase 6.
          </p>
        </Card>
      </div>
    </main>
  );
}
