// GET/POST /api/admin/developer/maintenance — Global maintenance switch & alert controls
// Superadmin / Developer access only

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { requireSuperadmin } from '@/lib/admin/session';
import { maintenanceToggleSchema } from '@/lib/validators/adminSchemas';
import { recordAuditLog } from '@/lib/admin/audit';
import type { SystemConfig } from '@/types';

export const dynamic = 'force-dynamic';

const DEFAULT_CONFIG: SystemConfig = {
  maintenanceMode: false,
  maintenanceMessage: 'SafeConnect is currently undergoing scheduled institutional maintenance.',
  rateLimitPerMinute: 60,
  readOnlyMode: false,
  alertBanner: {
    enabled: false,
    text: '',
    level: 'info',
  },
  lastHealthCheck: new Date().toISOString(),
};

export async function GET(request: NextRequest) {
  const authCheck = await requireSuperadmin(request);
  if ('response' in authCheck) {
    return authCheck.response;
  }

  try {
    const db = getAdminDb();
    const configDoc = await db.collection('system').doc('config').get();

    if (!configDoc.exists) {
      return NextResponse.json({ config: DEFAULT_CONFIG });
    }

    return NextResponse.json({ config: configDoc.data() });
  } catch {
    return NextResponse.json({ config: DEFAULT_CONFIG });
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await requireSuperadmin(request);
  if ('response' in authCheck) {
    return authCheck.response;
  }
  const user = authCheck.user;

  try {
    const body = await request.json();
    const result = maintenanceToggleSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid configuration payload', details: result.error.issues },
        { status: 400 }
      );
    }

    const data = result.data;
    const db = getAdminDb();
    const now = new Date().toISOString();

    const updatedConfig: SystemConfig = {
      maintenanceMode: data.maintenanceMode,
      maintenanceMessage:
        data.maintenanceMessage ||
        'SafeConnect is currently undergoing scheduled institutional maintenance.',
      rateLimitPerMinute: data.rateLimitPerMinute || 60,
      readOnlyMode: data.readOnlyMode ?? false,
      alertBanner: data.alertBanner,
      lastHealthCheck: now,
    };

    await db.collection('system').doc('config').set(updatedConfig, { merge: true });

    // Record audit log
    await recordAuditLog({
      action: 'UPDATE_SYSTEM_MAINTENANCE_CONFIG',
      performedByUid: user.uid,
      reportId: 'SYSTEM',
      details: {
        maintenanceMode: data.maintenanceMode,
        readOnlyMode: data.readOnlyMode,
      },
    });

    return NextResponse.json({ success: true, config: updatedConfig });
  } catch (error) {
    console.error('[SafeConnect Maintenance Toggle] Error:', error);
    return NextResponse.json({ error: 'Failed to update system config' }, { status: 500 });
  }
}
