// GET/POST /api/admin/developer/pii-scan — Zero-PII compliance scanner & redaction tool
// Superadmin / Developer access only

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { requireSuperadmin } from '@/lib/admin/session';
import { scanForPiiLeaks, sanitizePii } from '@/lib/admin/diagnostics';
import { piiRedactSchema } from '@/lib/validators/adminSchemas';
import { recordAuditLog } from '@/lib/admin/audit';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authCheck = await requireSuperadmin(request);
  if ('response' in authCheck) {
    return authCheck.response;
  }

  try {
    const flaggedItems = await scanForPiiLeaks();
    return NextResponse.json({
      flaggedCount: flaggedItems.length,
      flaggedItems,
    });
  } catch (error) {
    console.error('[SafeConnect PII Scan] Error:', error);
    return NextResponse.json({ error: 'Failed to complete PII scan' }, { status: 500 });
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
    const result = piiRedactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid document ID', details: result.error.issues },
        { status: 400 }
      );
    }

    const { docId } = result.data;
    const db = getAdminDb();
    const docRef = db.collection('reports').doc(docId);
    const snap = await docRef.get();

    if (!snap.exists) {
      return NextResponse.json({ error: 'Report document not found' }, { status: 404 });
    }

    const data = snap.data();
    const originalDesc = data?.description || '';
    const sanitizedDesc = sanitizePii(originalDesc);

    await docRef.update({
      description: sanitizedDesc,
      piiSanitized: true,
      updatedAt: new Date().toISOString(),
    });

    // Record audit log
    await recordAuditLog({
      action: 'REDACT_PII_LEAK',
      performedByUid: user.uid,
      reportId: data?.caseId || docId,
      details: { docId },
    });

    return NextResponse.json({
      success: true,
      message: 'PII successfully redacted from document',
      sanitizedSnippet: sanitizedDesc.substring(0, 100) + '...',
    });
  } catch (error) {
    console.error('[SafeConnect PII Redact] Error:', error);
    return NextResponse.json({ error: 'Failed to redact PII' }, { status: 500 });
  }
}
