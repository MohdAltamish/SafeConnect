// GET /api/admin/cases/[caseId] — Complete investigation case workspace for authorities

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { requireAuthority } from '@/lib/admin/session';
import { recordAuditLog } from '@/lib/admin/audit';
import type { Report, Message, CommitteeNote } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { caseId: string } }
) {
  const authCheck = await requireAuthority(request);
  if ('response' in authCheck) {
    return authCheck.response;
  }
  const user = authCheck.user;
  const caseId = params.caseId?.trim().toUpperCase();

  if (!caseId) {
    return NextResponse.json({ error: 'Case ID is required' }, { status: 400 });
  }

  try {
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
        { error: 'Unauthorized: This grievance is assigned to a different committee' },
        { status: 403 }
      );
    }

    // Fetch messages
    const msgSnap = await doc.ref.collection('messages').orderBy('createdAt', 'asc').get();
    const messages: Message[] = msgSnap.docs.map((d) => ({
      id: d.id,
      senderRole: d.data().senderRole,
      text: d.data().text,
      createdAt: d.data().createdAt,
    }));

    // Fetch internal committee notes
    const notesSnap = await doc.ref.collection('notes').orderBy('createdAt', 'asc').get();
    const notes: CommitteeNote[] = notesSnap.docs.map((d) => ({
      id: d.id,
      authorUid: d.data().authorUid,
      authorName: d.data().authorName,
      department: d.data().department,
      noteText: d.data().noteText,
      isFormalMinute: d.data().isFormalMinute ?? false,
      createdAt: d.data().createdAt,
    }));

    // Calculate AICTE 7-day meeting countdown and 14-day BOG resolution deadline
    const createdTime = new Date(data.createdAt).getTime();
    const daysSinceCreation = Math.floor((Date.now() - createdTime) / (1000 * 60 * 60 * 24));
    const meetingDaysRemaining = Math.max(0, 7 - daysSinceCreation);
    const resolutionDaysRemaining = Math.max(0, 14 - daysSinceCreation);

    // Audit log case view
    await recordAuditLog({
      action: 'AUTHORITY_INSPECT_CASE',
      performedByUid: user.uid,
      reportId: caseId,
      details: { department: user.department },
    });

    const caseData = {
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
      closureNote: data.closureNote || null,
      quorumMembers: data.quorumMembers || [],
      piiSanitized: data.piiSanitized ?? false,
    };

    return NextResponse.json({
      report: caseData,
      case: caseData,
      messages,
      notes,
      sla: {
        daysSinceCreation,
        meetingDaysRemaining,
        resolutionDaysRemaining,
        isMeetingUrgent: data.status === 'NEW' && meetingDaysRemaining <= 2,
      },
    });
  } catch (error) {
    console.error('[SafeConnect Admin Case Detail] Error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Failed to retrieve case details' }, { status: 500 });
  }
}
