'use client';

import React, { useEffect, useState } from 'react';
import { SystemHealthCard } from '@/components/admin/developer/SystemHealthCard';
import { KillswitchPanel } from '@/components/admin/developer/KillswitchPanel';
import { PIIScannerWidget } from '@/components/admin/developer/PIIScannerWidget';
import { DatabaseRepairTool } from '@/components/admin/developer/DatabaseRepairTool';
import { UserManagementModal } from '@/components/admin/developer/UserManagementModal';
import { type HealthCheckResult } from '@/lib/admin/diagnostics';
import { Wrench, ShieldAlert } from 'lucide-react';

export default function DeveloperRescuePage() {
  const [initialHealth, setInitialHealth] = useState<HealthCheckResult | null>(null);

  useEffect(() => {
    fetch('/api/admin/developer/health')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setInitialHealth(data))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-warning/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-warning/20 border border-warning/40 flex items-center justify-center text-warning">
              <Wrench className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">
              Developer & Creator Emergency Panel
            </h1>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Break-Glass System Telemetry, Integrity Healer & Zero-PII Leak Scanner
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-warning/15 text-warning border border-warning/30">
          <ShieldAlert className="w-3.5 h-3.5" /> Superadmin Mode Active
        </div>
      </div>

      {/* Telemetry card */}
      <SystemHealthCard initialHealth={initialHealth} />

      {/* Killswitch Controls */}
      <KillswitchPanel />

      {/* PII Leak Scanner */}
      <PIIScannerWidget />

      {/* Database Integrity & Staging */}
      <DatabaseRepairTool />

      {/* Authority Account Provisioning */}
      <UserManagementModal />
    </div>
  );
}
