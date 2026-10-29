// POST /api/admin/auth/session — Issue secure session cookie for logged in authorities

import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken, mockRole } = body;

    // Local dev mock session support
    if (process.env.NODE_ENV !== 'production' && mockRole) {
      const response = NextResponse.json({
        success: true,
        message: `Authenticated as ${mockRole} (Development Mock)`,
      });
      response.cookies.set('__dev_mock', mockRole, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
      if (mockRole === 'superadmin') {
        response.cookies.set('__dev_verified', 'true', {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        });
      }
      return response;
    }

    if (!idToken) {
      return NextResponse.json({ error: 'ID token required' }, { status: 400 });
    }

    const adminAuth = getAdminAuth();
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Verify institutional domain or superadmin role
    const email = decodedToken.email || '';
    if (!email.toLowerCase().endsWith('@glbitm.ac.in') && decodedToken.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Access denied: Must use an official @glbitm.ac.in email address' },
        { status: 403 }
      );
    }

    // Check authority doc in Firestore
    const db = getAdminDb();
    const authSnap = await db.collection('authorities').doc(decodedToken.uid).get();

    if (authSnap.exists && authSnap.data()?.active === false) {
      return NextResponse.json(
        { error: 'Your authority account has been deactivated. Please contact the administrator.' },
        { status: 403 }
      );
    }

    // Create session cookie with 5-day expiration
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const isSuperadmin = decodedToken.role === 'superadmin' || authSnap.data()?.role === 'superadmin';

    const response = NextResponse.json({
      success: true,
      user: {
        uid: decodedToken.uid,
        email,
        role: isSuperadmin ? 'superadmin' : 'authority',
      },
    });

    response.cookies.set('__session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: expiresIn / 1000,
    });

    if (isSuperadmin) {
      response.cookies.set('__dev_verified', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: expiresIn / 1000,
      });
    }

    return response;
  } catch (error) {
    console.error('[SafeConnect Auth Session] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Session authentication failed' },
      { status: 401 }
    );
  }
}
