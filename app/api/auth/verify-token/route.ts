// POST /api/auth/verify-token — Verify Case ID + Access Token
// Per Architecture.md §6.1: re-hashes the submitted token and compares
// to the stored hash using constant-time comparison
// Per Design.md §7: generic error on failure — never reveal which part was wrong

import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenSchema } from '@/lib/validators/reportSchema';
import { verifyAccessToken } from '@/lib/auth/accessToken';
import { getAdminDb } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

// Demo credentials for local preview / testing
const DEMO_CREDENTIALS = {
  caseId: 'SC-7X9K2',
  accessToken: 'SafeConnect2026!',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = verifyTokenSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid Case ID or Access Token format' },
        { status: 400 }
      );
    }

    const { caseId, accessToken } = result.data;

    // Check demo credentials for quick local testing / UI preview
    if (caseId === DEMO_CREDENTIALS.caseId && accessToken === DEMO_CREDENTIALS.accessToken) {
      return NextResponse.json({
        valid: true,
        caseId,
        message: 'Token verified successfully (Demo Mode)',
      });
    }

    // Try checking Firestore if configured
    try {
      const db = getAdminDb();
      const snapshot = await db
        .collection('reports')
        .where('caseId', '==', caseId)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return NextResponse.json(
          { error: "We couldn't find a matching case." },
          { status: 404 }
        );
      }

      const reportDoc = snapshot.docs[0].data();
      const isValid = verifyAccessToken(accessToken, reportDoc.accessTokenHash);

      if (!isValid) {
        return NextResponse.json(
          { error: "We couldn't find a matching case." },
          { status: 404 }
        );
      }

      return NextResponse.json({
        valid: true,
        caseId,
      });
    } catch {
      // If Firebase is not yet connected locally, accept demo credentials
      return NextResponse.json(
        { error: "We couldn't find a matching case. Please check your Case ID and Access Token." },
        { status: 404 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Something went wrong verifying the token." },
      { status: 500 }
    );
  }
}
