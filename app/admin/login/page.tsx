'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Shield, Lock, AlertCircle, Loader2, Sparkles, UserCheck } from 'lucide-react';
import { auth } from '@/lib/firebase/client';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/admin/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDevMockLogin = async (mockRole: 'superadmin' | 'ic_head' | 'warden') => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mockRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Mock session failed');
      }
      router.push(redirectPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFirebaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Verify institutional domain
    if (!email.toLowerCase().endsWith('@glbitm.ac.in')) {
      setError('Access Restricted: You must log in using an official @glbitm.ac.in email address.');
      setIsLoading(false);
      return;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();

      const res = await fetch('/api/admin/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize session');
      }

      router.push(redirectPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials or connection error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white mx-auto shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Authority & Committee Sign In
          </h1>
          <p className="text-xs text-text-muted">
            GLBITM Statutory Grievance Redressal Portal
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-error-50 border border-error/20 flex items-start gap-2.5 text-xs text-error">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Development Quick-Switch Box */}
        <div className="p-4 rounded-2xl bg-surface border border-primary/20 shadow-xs space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Sparkles className="w-3.5 h-3.5" /> Development Quick-Auth (Local Testing)
          </div>
          <p className="text-[11px] text-text-muted">
            Instant 1-click authority mock sessions without needing Firebase Auth user creation:
          </p>
          <div className="grid grid-cols-1 gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={() => handleDevMockLogin('superadmin')}
              className="text-xs justify-start h-9 border-warning/40 hover:bg-warning/10"
            >
              <UserCheck className="w-3.5 h-3.5 mr-2 text-warning" />
              Sign In as Superadmin (Mohd Altamish)
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={() => handleDevMockLogin('ic_head')}
              className="text-xs justify-start h-9 hover:bg-surface-tint"
            >
              <UserCheck className="w-3.5 h-3.5 mr-2 text-primary" />
              Sign In as IC Presiding Officer (Dr. Rashmi Mishra)
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={() => handleDevMockLogin('warden')}
              className="text-xs justify-start h-9 hover:bg-surface-tint"
            >
              <UserCheck className="w-3.5 h-3.5 mr-2 text-primary" />
              Sign In as Hostel Warden
            </Button>
          </div>
        </div>

        {/* Production Firebase Credentials Form */}
        <Card padding="lg">
          <form onSubmit={handleFirebaseLogin} className="space-y-4">
            <span className="text-xs font-semibold text-text-primary block border-b border-border pb-2">
              Official Email & Password Login
            </span>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                College Institutional Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="faculty@glbitm.ac.in"
                className="w-full text-xs rounded-xl border border-border bg-surface px-3 py-2.5 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <span className="text-[10px] text-text-muted mt-1 block">
                Must end with @glbitm.ac.in
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs rounded-xl border border-border bg-surface px-3 py-2.5 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full text-xs h-10 mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Lock className="w-3.5 h-3.5 mr-2" />
              )}
              Authenticate with Credentials
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
