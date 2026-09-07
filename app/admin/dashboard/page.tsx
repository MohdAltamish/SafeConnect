import { Card } from '@/components/ui/Card';

export const metadata = {
  title: 'Dashboard — SafeConnect Admin',
};

/**
 * Authority dashboard per Design.md §7:
 * Table/list of case cards, filter by status, sorted newest first.
 * Placeholder for Phase 4 (FR4).
 */
export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-surface-tint">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-text-primary mb-6">Dashboard</h1>
        <Card padding="lg">
          <p className="text-sm text-text-muted text-center py-8">
            Authority dashboard will be implemented in Phase 4.
          </p>
        </Card>
      </div>
    </main>
  );
}
