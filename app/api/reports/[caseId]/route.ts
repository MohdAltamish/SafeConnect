// GET /api/reports/[caseId] — Retrieve incident report details
// Accessible by student with Access Token OR authenticated authority

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { verifyAccessToken } from '@/lib/auth/accessToken';
import { getAuthenticatedAuthority } from '@/lib/admin/session';
import { recordAuditLog } from '@/lib/admin/audit';
import type { Report } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { caseId: string } }
) {
  try {
    const caseId = params.caseId?.trim().toUpperCase();
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get('accessToken')?.trim() || request.headers.get('x-access-token')?.trim();

    if (!caseId) {
      return NextResponse.json({ error: 'Case ID is required' }, { status: 400 });
    }

    const authUser = await getAuthenticatedAuthority(request);
    const db = getAdminDb();
    const snapshot = await db.collection('reports').where('caseId', '==', caseId).limit(1).get();

    if (snapshot.empty) {
      return NextResponse.json(
        { error: "We couldn't find a matching case." },
        { status: 404 }
      );
    }

    const doc = snapshot.docs[0];
    const data = doc.data() as Report;

    // Authorization verification
    let authorized = false;

    if (authUser) {
      if (authUser.role === 'superadmin' || authUser.department === data.routedTo) {
        authorized = true;
        // Audit log authority view
        await recordAuditLog({
          action: 'VIEW_CASE_DETAIL',
          performedByUid: authUser.uid,
          reportId: caseId,
          details: { department: authUser.department },
        });
      }
    }

    if (!authorized && accessToken) {
      authorized = verifyAccessToken(accessToken, data.accessTokenHash);
    }

    if (!authorized) {
      return NextResponse.json(
        { error: 'Invalid Case ID or Access Token. Access denied.' },
        { status: 403 }
      );
    }

    // Return sanitized report (NEVER return accessTokenHash to client)
    const safeReport = {
      id: doc.id,
      caseId: data.caseId,
      category: data.category,
      description: data.description,
      location: data.location || null,
      incidentDate: data.incidentDate || null,
      evidenceUrls: data.evidenceUrls || [],
      routedTo: data.routedTo,
      status: data.status,
      severity: data.severity || null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      closedAt: data.closedAt || null,
      closureNote: authUser ? data.closureNote : undefined,
    };

    return NextResponse.json({ report: safeReport });
  } catch (error) {
    console.error('[SafeConnect Reports] Error fetching case:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to retrieve case details.' },
      { status: 500 }
    );
  }
}
