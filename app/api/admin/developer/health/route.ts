// GET /api/admin/developer/health — System telemetry & diagnostic runner
// Superadmin / Developer access only

import { NextRequest, NextResponse } from 'next/server';
import { requireSuperadmin } from '@/lib/admin/session';
import { runSystemHealthCheck } from '@/lib/admin/diagnostics';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authCheck = await requireSuperadmin(request);
  if ('response' in authCheck) {
    return authCheck.response;
  }

  try {
    const health = await runSystemHealthCheck();
    return NextResponse.json(health);
  } catch (error) {
    console.error('[SafeConnect HealthCheck] Error:', error);
    return NextResponse.json(
      {
        systemStatus: 'OUTAGE',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Diagnostic run failed',
      },
      { status: 500 }
    );
  }
}
