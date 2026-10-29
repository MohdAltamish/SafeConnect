// GET/POST /api/admin/cases/[caseId]/notes — Confidential internal committee minutes and notes
// Strictly hidden from the reporting student — accessible only to committee members

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { requireAuthority } from '@/lib/admin/session';
import { committeeNoteSchema } from '@/lib/validators/adminSchemas';
import { recordAuditLog } from '@/lib/admin/audit';
import type { Report, CommitteeNote } from '@/types';

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

  try {
    const db = getAdminDb();
    const snap = await db.collection('reports').where('caseId', '==', caseId).limit(1).get();

    if (snap.empty) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    const reportDoc = snap.docs[0];
    const reportData = reportDoc.data() as Report;

    if (user.role !== 'superadmin' && user.department !== reportData.routedTo) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const notesSnap = await reportDoc.ref.collection('notes').orderBy('createdAt', 'desc').get();
    const notes: CommitteeNote[] = notesSnap.docs.map((d) => ({
      id: d.id,
      authorUid: d.data().authorUid,
      authorName: d.data().authorName,
      department: d.data().department,
      noteText: d.data().noteText,
      isFormalMinute: d.data().isFormalMinute ?? false,
      createdAt: d.data().createdAt,
    }));

    return NextResponse.json({ notes });
  } catch (error) {
    console.error('[SafeConnect Notes] Error fetching notes:', error);
    return NextResponse.json({ error: 'Failed to retrieve notes' }, { status: 500 });
  }
}

export async function POST(
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
    const result = committeeNoteSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid note data', details: result.error.issues },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    const snap = await db.collection('reports').where('caseId', '==', caseId).limit(1).get();

    if (snap.empty) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    const reportDoc = snap.docs[0];
    const reportData = reportDoc.data() as Report;

    if (user.role !== 'superadmin' && user.department !== reportData.routedTo) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const now = new Date().toISOString();
    const noteData = {
      authorUid: user.uid,
      authorName: user.name,
      department: user.department,
      noteText: result.data.noteText.trim(),
      isFormalMinute: result.data.isFormalMinute ?? false,
      createdAt: now,
    };

    const newNoteRef = await reportDoc.ref.collection('notes').add(noteData);

    // Record audit log
    await recordAuditLog({
      action: 'ADD_COMMITTEE_NOTE',
      performedByUid: user.uid,
      reportId: caseId,
      details: { isFormalMinute: result.data.isFormalMinute },
    });

    return NextResponse.json({
      success: true,
      note: {
        id: newNoteRef.id,
        ...noteData,
      },
    });
  } catch (error) {
    console.error('[SafeConnect Notes] Error adding note:', error);
    return NextResponse.json({ error: 'Failed to save note' }, { status: 500 });
  }
}
