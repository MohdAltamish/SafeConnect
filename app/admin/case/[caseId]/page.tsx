import { Card } from '@/components/ui/Card';

export const metadata = {
  title: 'Case Detail — SafeConnect Admin',
};

/**
 * Authority case detail page per Design.md §7:
 * Full description, evidence gallery, status dropdown, chat thread,
 * internal closure note field.
 * Placeholder for Phase 4 (FR4).
 */
export default function AdminCaseDetailPage() {
  return (
    <main className="min-h-screen bg-surface-tint">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-text-primary mb-6">Case Detail</h1>
        <Card padding="lg">
          <p className="text-sm text-text-muted text-center py-8">
            Authority case detail view will be implemented in Phase 4.
          </p>
        </Card>
      </div>
    </main>
  );
}
