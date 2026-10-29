'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { type HealthCheckResult } from '@/lib/admin/diagnostics';
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Server,
  Database,
  Shield,
  Clock,
} from 'lucide-react';

interface SystemHealthCardProps {
  initialHealth: HealthCheckResult | null;
}

export function SystemHealthCard({ initialHealth }: SystemHealthCardProps) {
  const [health, setHealth] = useState<HealthCheckResult | null>(initialHealth);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHealth = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/developer/health');
      const data = await res.json();
      if (res.ok) {
        setHealth(data);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const isHealthy = health?.systemStatus === 'OPERATIONAL';

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-text-primary">
            Live System Telemetry & Health
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              isHealthy
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-error-50 text-error border border-error/20'
            }`}
          >
            {isHealthy ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5" />
            )}
            <span>{health?.systemStatus || 'UNKNOWN'}</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={fetchHealth}
            disabled={isLoading}
            className="p-1.5 h-8 w-8"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Firestore status */}
        <div className="p-3 rounded-xl bg-surface-tint border border-border/60">
          <div className="flex items-center gap-1.5 text-[10px] text-text-muted mb-1">
            <Database className="w-3 h-3 text-primary" /> Cloud Firestore
          </div>
          <span className="text-xs font-bold text-text-primary">
            {health?.checks.firestore.status === 'healthy' ? 'Connected' : 'Degraded'}
          </span>
          {health?.checks.firestore.latencyMs !== undefined && (
            <span className="block text-[10px] text-text-muted mt-0.5">
              Ping: {health.checks.firestore.latencyMs}ms
            </span>
          )}
        </div>

        {/* Environment status */}
        <div className="p-3 rounded-xl bg-surface-tint border border-border/60">
          <div className="flex items-center gap-1.5 text-[10px] text-text-muted mb-1">
            <Server className="w-3 h-3 text-primary" /> Environment Keys
          </div>
          <span className="text-xs font-bold text-text-primary">
            {health?.checks.environment.status === 'healthy' ? 'Verified' : 'Missing Keys'}
          </span>
          <span className="block text-[10px] text-text-muted mt-0.5">
            Admin + Hash Pepper
          </span>
        </div>

        {/* Unrouted cases */}
        <div className="p-3 rounded-xl bg-surface-tint border border-border/60">
          <div className="flex items-center gap-1.5 text-[10px] text-text-muted mb-1">
            <Shield className="w-3 h-3 text-primary" /> Routing Pipeline
          </div>
          <span className="text-xs font-bold text-text-primary">
            {health?.checks.unroutedCases.count === 0 ? '0 Unrouted' : `${health?.checks.unroutedCases.count} Failed`}
          </span>
          <span className="block text-[10px] text-text-muted mt-0.5">
            Auto-routing healthy
          </span>
        </div>

        {/* Stale cases */}
        <div className="p-3 rounded-xl bg-surface-tint border border-border/60">
          <div className="flex items-center gap-1.5 text-[10px] text-text-muted mb-1">
            <Clock className="w-3 h-3 text-primary" /> SLA Watchdog
          </div>
          <span
            className={`text-xs font-bold ${
              health?.checks.staleCases.alert ? 'text-error' : 'text-text-primary'
            }`}
          >
            {health?.checks.staleCases.count || 0} Overdue
          </span>
          <span className="block text-[10px] text-text-muted mt-0.5">
            7-day mandate watch
          </span>
        </div>
      </div>
    </div>
  );
}
