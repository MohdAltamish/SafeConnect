'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Search, Loader2 } from 'lucide-react';

export default function TrackPage() {
  const router = useRouter();
  const [caseId, setCaseId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!caseId.trim() || !accessToken.trim()) {
      setError('Please enter both your Case ID and Access Token.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId: caseId.trim(), accessToken: accessToken.trim() }),
      });

      if (!response.ok) {
        // Per Design.md §7: Generic error — never reveal which part was wrong
        setError('We couldn\'t find a matching case. Please check your Case ID and Access Token.');
        return;
      }

      // Navigate to case detail
      // Store token temporarily in sessionStorage for the case detail page
      // (cleared when browser tab closes — no persistent cookies per Rules.md §1.5)
      sessionStorage.setItem(`sc-token-${caseId.trim()}`, accessToken.trim());
      router.push(`/track/${caseId.trim()}`);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-[640px]">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
              Track Your Report
            </h1>
            <p className="text-sm text-text-muted">
              Enter your Case ID and Access Token to view your report status.
            </p>
          </div>

          <Card padding="lg">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input
                label="Case ID"
                placeholder="SC-XXXXX"
                value={caseId}
                onChange={(e) => {
                  setCaseId(e.target.value.toUpperCase());
                  setError('');
                }}
                autoComplete="off"
              />

              <Input
                label="Access Token"
                placeholder="Your 16-character token"
                value={accessToken}
                onChange={(e) => {
                  setAccessToken(e.target.value);
                  setError('');
                }}
                autoComplete="off"
              />

              {error && (
                <p className="text-sm text-danger" role="alert">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Checking…
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    View Report
                  </>
                )}
              </Button>
            </form>
          </Card>

          <p className="text-xs text-text-muted text-center mt-4">
            Lost your token? Unfortunately, we can&apos;t recover it — this is by design to
            protect your anonymity.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
