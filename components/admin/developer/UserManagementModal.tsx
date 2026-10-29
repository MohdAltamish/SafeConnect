'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { type Authority, DEPARTMENT } from '@/types';
import { Users, UserPlus, Loader2, Check, AlertCircle } from 'lucide-react';

export function UserManagementModal() {
  const [users, setUsers] = useState<Authority[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState<string>(DEPARTMENT.INTERNAL_COMMITTEE);
  const [role, setRole] = useState<'authority' | 'superadmin'>('authority');
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/developer/users');
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.toLowerCase().endsWith('@glbitm.ac.in')) {
      setError('Authority accounts must use official @glbitm.ac.in institutional emails.');
      return;
    }

    setIsProvisioning(true);
    try {
      const res = await fetch('/api/admin/developer/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          department,
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to provision authority');
      }

      setSuccess(`Successfully provisioned account for ${email}`);
      setEmail('');
      setName('');
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error provisioning user');
    } finally {
      setIsProvisioning(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-text-primary">
            Authority Account Provisioning & Roles
          </h3>
        </div>
        <span className="text-xs text-text-muted font-mono">
          {users.length} Active Authorities
        </span>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-error-50 border border-error/20 flex items-start gap-2 text-xs text-error">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2 text-xs text-emerald-800">
          <Check className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {/* Provision Form */}
      <form onSubmit={handleAddUser} className="p-4 rounded-xl bg-surface-tint border border-border/70 space-y-3">
        <span className="text-xs font-semibold text-text-primary block flex items-center gap-1.5">
          <UserPlus className="w-3.5 h-3.5 text-primary" /> Provision New Committee Member
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-text-secondary mb-1">
              Institutional Email (@glbitm.ac.in)
            </label>
            <input
              type="email"
              required
              placeholder="faculty.name@glbitm.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-text-primary"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-text-secondary mb-1">
              Full Name & Designation
            </label>
            <input
              type="text"
              required
              placeholder="Dr. Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-text-primary"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-text-secondary mb-1">
              Statutory Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-text-primary"
            >
              <option value={DEPARTMENT.INTERNAL_COMMITTEE}>Internal Committee (IC) / Women Cell</option>
              <option value={DEPARTMENT.ANTI_RAGGING_CELL}>Anti-Ragging Committee</option>
              <option value={DEPARTMENT.DISCIPLINE_COMMITTEE}>Discipline Committee</option>
              <option value={DEPARTMENT.WARDEN}>Hostel Warden</option>
              <option value={DEPARTMENT.PR_CELL}>General Grievance Cell</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-text-secondary mb-1">
              Role Authority Level
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'authority' | 'superadmin')}
              className="w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-text-primary"
            >
              <option value="authority">Standard Committee Authority</option>
              <option value="superadmin">Superadmin / System Creator</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <Button
            type="submit"
            size="sm"
            disabled={isProvisioning || !email || !name}
            className="flex items-center gap-1.5 text-xs"
          >
            {isProvisioning && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Grant Official Access
          </Button>
        </div>
      </form>

      {/* Existing Authorities List */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-text-secondary block">
          Current Authorized Members
        </span>
        <div className="divide-y divide-border/60 border border-border rounded-xl overflow-hidden max-h-56 overflow-y-auto">
          {isLoading && (
            <div className="p-4 text-center text-text-muted text-xs flex items-center justify-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading authorities...
            </div>
          )}
          {!isLoading && users.length === 0 && (
            <div className="p-4 text-center text-text-muted text-xs">
              No custom authorities provisioned yet.
            </div>
          )}
          {users.map((u) => (
            <div key={u.uid} className="p-3 bg-surface text-xs flex items-center justify-between">
              <div>
                <span className="font-semibold text-text-primary">{u.name}</span>
                <span className="text-[11px] text-text-muted block font-mono">{u.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={u.role === 'superadmin' ? 'warning' : 'outline'} size="sm">
                  {u.role}
                </Badge>
                <span className="text-[10px] text-text-muted">
                  {u.department}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
