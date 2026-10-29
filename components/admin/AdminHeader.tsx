'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, LayoutDashboard, BarChart3, Wrench, LogOut, User } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { AuthenticatedUser } from '@/lib/admin/session';

interface AdminHeaderProps {
  user: AuthenticatedUser | null;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch {
      // fallback ignore error on logout
    }
    router.push('/admin/login');
    router.refresh();
  };

  const isSuperadmin = user?.role === 'superadmin';

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-40">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-text-primary text-base tracking-tight flex items-center gap-1.5">
                SafeConnect <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-primary-50 text-primary">Admin</span>
              </span>
              <span className="text-[10px] text-text-muted block leading-none">
                GLBITM Statutory Portal
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 ml-6">
            <Link
              href="/admin/dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                pathname === '/admin/dashboard'
                  ? 'bg-surface-tint text-primary font-semibold'
                  : 'text-text-muted hover:text-text-primary hover:bg-surface-tint/50'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Cases
            </Link>
            <Link
              href="/admin/analytics"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                pathname === '/admin/analytics'
                  ? 'bg-surface-tint text-primary font-semibold'
                  : 'text-text-muted hover:text-text-primary hover:bg-surface-tint/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Analytics
            </Link>
            {isSuperadmin && (
              <Link
                href="/admin/developer"
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  pathname.startsWith('/admin/developer')
                    ? 'bg-warning/10 text-warning font-semibold border border-warning/30'
                    : 'text-warning/80 hover:text-warning hover:bg-warning/10'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                Rescue Panel
              </Link>
            )}
          </nav>
        </div>

        {/* User profile & actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-medium text-text-primary flex items-center gap-1 justify-end">
                  <User className="w-3 h-3 text-text-muted" />
                  {user.name}
                </span>
                <div className="flex items-center gap-1.5 justify-end mt-0.5">
                  <Badge variant={isSuperadmin ? 'warning' : 'outline'} size="sm">
                    {user.role}
                  </Badge>
                  <span className="text-[10px] text-text-muted font-mono">
                    {user.department.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Log out of authority session"
                className="p-2 rounded-lg text-text-muted hover:text-error hover:bg-error-50 transition-colors ml-2"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/admin/login"
              className="text-xs font-medium text-primary hover:underline"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
