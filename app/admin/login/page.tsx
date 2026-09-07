import { Card } from '@/components/ui/Card';

export const metadata = {
  title: 'Authority Login — SafeConnect',
};

/**
 * Authority login page — Firebase Auth, college email domain only.
 * Placeholder for Phase 4 (FR4).
 */
export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-surface-tint">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-text-primary">Authority Login</h1>
          <p className="text-sm text-text-muted mt-1">SafeConnect Admin Dashboard</p>
        </div>
        <Card padding="lg">
          <p className="text-sm text-text-muted text-center py-4">
            Authority login will be implemented in Phase 4.
          </p>
        </Card>
      </div>
    </main>
  );
}
