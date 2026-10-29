// Direct Anonymous Chat Endpoint — Student & Authority Two-Way Communication
// Per Architecture.md §2 & Rules.md §1:
// - All messages stored with senderRole only (never student identity)
// - Student authenticates via Case ID + Access Token
// - Authority authenticates via session cookie / role verification

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { messageSchema } from '@/lib/validators/reportSchema';
import { verifyAccessToken } from '@/lib/auth/accessToken';
import { getAuthenticatedAuthority } from '@/lib/admin/session';
import { recordAuditLog } from '@/lib/admin/audit';
import type { Message, SenderRole } from '@/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/messages?caseId=SC-XXXXX&accessToken=...
 * Fetch messages for a case. Accessible by the reporting student or the assigned authority.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const caseId = searchParams.get('caseId')?.trim().toUpperCase();
    const accessToken = searchParams.get('accessToken')?.trim();

    if (!caseId) {
      return NextResponse.json({ error: 'Case ID is required' }, { status: 400 });
    }

    // Check authority session first
    const authorityUser = await getAuthenticatedAuthority(request);

    const db = getAdminDb();
    const reportSnap = await db.collection('reports').where('caseId', '==', caseId).limit(1).get();

    if (reportSnap.empty) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    const reportDoc = reportSnap.docs[0];
    const reportData = reportDoc.data();

    // Verify access rights:
    let isAuthorized = false;

    if (authorityUser) {
      // Authority must belong to assigned department or be a superadmin
      if (authorityUser.role === 'superadmin' || authorityUser.department === reportData.routedTo) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized && accessToken) {
      // Student verification using token hash
      isAuthorized = verifyAccessToken(accessToken, reportData.accessTokenHash);
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized to view this conversation' },
        { status: 403 }
      );
    }

    // Fetch messages subcollection
    const messagesSnap = await reportDoc.ref
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .get();

    const messages: Message[] = messagesSnap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        senderRole: data.senderRole as SenderRole,
        text: data.text,
        createdAt: data.createdAt,
      };
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('[SafeConnect Messages] Error fetching messages:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to retrieve messages' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/messages
 * Send a message into the anonymous case thread.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = messageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid message payload', details: result.error.issues },
        { status: 400 }
      );
    }

    const { caseId, text, senderRole, accessToken } = result.data;
    const now = new Date().toISOString();

    const db = getAdminDb();
    const reportSnap = await db.collection('reports').where('caseId', '==', caseId).limit(1).get();

    if (reportSnap.empty) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    const reportDoc = reportSnap.docs[0];
    const reportData = reportDoc.data();

    // Verify sender identity and permission
    if (senderRole === 'student') {
      if (!accessToken) {
        return NextResponse.json({ error: 'Access token required for student' }, { status: 401 });
      }
      const isValid = verifyAccessToken(accessToken, reportData.accessTokenHash);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid access token' }, { status: 403 });
      }
    } else if (senderRole === 'authority') {
      const authUser = await getAuthenticatedAuthority(request);
      if (!authUser) {
        return NextResponse.json({ error: 'Authority authentication required' }, { status: 401 });
      }
      if (authUser.role !== 'superadmin' && authUser.department !== reportData.routedTo) {
        return NextResponse.json(
          { error: 'Unauthorized: Cannot post messages to other department cases' },
          { status: 403 }
        );
      }

      // Record audit log for authority sending message
      await recordAuditLog({
        action: 'SEND_AUTHORITY_MESSAGE',
        performedByUid: authUser.uid,
        reportId: caseId,
        details: { department: authUser.department },
      });
    }

    // Add message to subcollection
    const newMsgRef = await reportDoc.ref.collection('messages').add({
      senderRole,
      text: text.trim(),
      createdAt: now,
    });

    // Update parent report updatedAt
    await reportDoc.ref.update({
      updatedAt: now,
    });

    return NextResponse.json({
      success: true,
      message: {
        id: newMsgRef.id,
        senderRole,
        text: text.trim(),
        createdAt: now,
      },
    });
  } catch (error) {
    console.error('[SafeConnect Messages] Error sending message:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
