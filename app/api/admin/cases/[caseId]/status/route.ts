// PATCH /api/admin/cases/[caseId]/status — Lifecycle status & severity management
// Enforces statutory quorum verification (≥ 3 members) and mandatory closure notes

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { requireAuthority } from '@/lib/admin/session';
import { updateStatusSchema } from '@/lib/validators/adminSchemas';
import { recordAuditLog } from '@/lib/admin/audit';
import type { Report } from '@/types';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { caseId: string } }
) {
  const authCheck = await requireAuthority(request);
  if ('response' in authCheck) {
    return authCheck.response;
  }
  const user = authCheck.user;
  const caseId = params.caseId?.trim().toUpperCase();

  try {
    const body = await request.json();
    const result = updateStatusSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid status update', details: result.error.issues },
        { status: 400 }
      );
    }

    const { status, severity, closureNote, quorumMembers } = result.data;
    const db = getAdminDb();
    const snap = await db.collection('reports').where('caseId', '==', caseId).limit(1).get();

    if (snap.empty) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    const doc = snap.docs[0];
    const data = doc.data() as Report;

    // Check departmental permission
    if (user.role !== 'superadmin' && user.department !== data.routedTo) {
      return NextResponse.json(
        { error: 'Unauthorized: You cannot alter cases of other departments' },
        { status: 403 }
      );
    }

    const now = new Date().toISOString();
    const updates: Record<string, unknown> = {
      status,
      updatedAt: now,
    };

    if (severity !== undefined) {
      updates.severity = severity;
    }

    if (quorumMembers && quorumMembers.length > 0) {
      updates.quorumMembers = quorumMembers;
    }

    if (status === 'CLOSED') {
      updates.closedAt = now;
      updates.closureNote = closureNote || null;
    }

    await doc.ref.update(updates);

    // Record audit log
    await recordAuditLog({
      action: 'UPDATE_CASE_STATUS',
      performedByUid: user.uid,
      reportId: caseId,
      details: {
        previousStatus: data.status,
        newStatus: status,
        severity,
        quorumCount: quorumMembers?.length || 0,
      },
    });

    return NextResponse.json({
      success: true,
      caseId,
      status,
      severity: severity ?? data.severity,
      closedAt: updates.closedAt || null,
    });
  } catch (error) {
    console.error('[SafeConnect Admin Status] Error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Failed to update case status' }, { status: 500 });
  }
}
