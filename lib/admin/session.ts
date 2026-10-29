// Admin session verification & RBAC authorization helper
import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin';
import type { Authority, AuthorityRole, Department } from '@/types';

export interface AuthenticatedUser {
  uid: string;
  email: string;
  name: string;
  department: Department;
  role: AuthorityRole;
  active: boolean;
}

// Development mock fallback for local testing when Firebase Admin is not connected
const DEV_MOCK_AUTHORITIES: Record<string, AuthenticatedUser> = {
  superadmin: {
    uid: 'dev-superadmin-uid',
    email: 'altamish@glbitm.ac.in',
    name: 'Mohd Altamish (Creator)',
    department: 'INTERNAL_COMMITTEE',
    role: 'superadmin',
    active: true,
  },
  ic_head: {
    uid: 'dev-ic-head-uid',
    email: 'rashmi.mishra@glbitm.ac.in',
    name: 'Dr. Rashmi Mishra (Presiding Officer)',
    department: 'INTERNAL_COMMITTEE',
    role: 'authority',
    active: true,
  },
  warden: {
    uid: 'dev-warden-uid',
    email: 'warden@glbitm.ac.in',
    name: 'Hostel Warden',
    department: 'WARDEN',
    role: 'authority',
    active: true,
  },
};

/**
 * Verifies session cookie or mock key and returns the AuthenticatedUser
 */
export async function getSessionUser(
  sessionCookie?: string | null,
  mockKey?: string | null
): Promise<AuthenticatedUser | null> {
  const isDev = process.env.NODE_ENV !== 'production';

  // 1. Dev mock quick switch
  if (mockKey && DEV_MOCK_AUTHORITIES[mockKey]) {
    return DEV_MOCK_AUTHORITIES[mockKey];
  }

  // 2. No session token provided
  if (!sessionCookie) {
    if (isDev && process.env.ENABLE_DEV_AUTO_AUTH === 'true') {
      return DEV_MOCK_AUTHORITIES.superadmin;
    }
    return null;
  }

  // 3. Verify session cookie or id token
  try {
    const adminAuth = getAdminAuth();
    let decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true).catch(() => null);
    if (!decodedToken) {
      decodedToken = await adminAuth.verifyIdToken(sessionCookie).catch(() => null);
    }

    if (!decodedToken) {
      return null;
    }

    const email = decodedToken.email || '';
    const isDomainAllowed =
      email.toLowerCase().endsWith('@glbitm.ac.in') || decodedToken.role === 'superadmin';

    if (!isDomainAllowed) {
      console.warn(`[SafeConnect Auth] Rejected non-institutional email: ${email}`);
      return null;
    }

    // 4. Fetch authority record from Firestore /authorities/{uid}
    const db = getAdminDb();
    const authDoc = await db.collection('authorities').doc(decodedToken.uid).get();

    if (authDoc.exists) {
      const data = authDoc.data() as Partial<Authority>;
      if (data.active === false) {
        console.warn(`[SafeConnect Auth] Deactivated authority attempted access: ${decodedToken.uid}`);
        return null;
      }
      return {
        uid: decodedToken.uid,
        email,
        name: data.name || decodedToken.name || 'Authority Member',
        department: (data.department as Department) || 'INTERNAL_COMMITTEE',
        role: (data.role as AuthorityRole) || (decodedToken.role === 'superadmin' ? 'superadmin' : 'authority'),
        active: data.active ?? true,
      };
    }

    if (decodedToken.role === 'superadmin') {
      return {
        uid: decodedToken.uid,
        email,
        name: decodedToken.name || 'System Administrator',
        department: 'INTERNAL_COMMITTEE',
        role: 'superadmin',
        active: true,
      };
    }

    return null;
  } catch (error) {
    console.error('[SafeConnect Auth] Session verification error:', error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Extracts and verifies the authenticated authority from cookies or authorization header.
 */
export async function getAuthenticatedAuthority(
  request: NextRequest
): Promise<AuthenticatedUser | null> {
  const mockHeader = request.headers.get('x-dev-mock-auth');
  const mockCookie = request.cookies.get('__dev_mock')?.value;
  const mockKey = mockHeader || mockCookie;

  if (mockKey && DEV_MOCK_AUTHORITIES[mockKey]) {
    return DEV_MOCK_AUTHORITIES[mockKey];
  }

  const sessionCookie = request.cookies.get('__session')?.value;
  const authHeader = request.headers.get('Authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const token = sessionCookie || bearerToken;

  return getSessionUser(token, mockKey);
}

/**
 * Middleware helper that ensures user is authenticated as an authority.
 */
export async function requireAuthority(
  request: NextRequest
): Promise<{ user: AuthenticatedUser } | { response: NextResponse }> {
  const user = await getAuthenticatedAuthority(request);
  if (!user) {
    return {
      response: NextResponse.json(
        { error: 'Unauthorized: Please log in with your institutional credentials' },
        { status: 401 }
      ),
    };
  }
  return { user };
}

/**
 * Middleware helper that ensures user is a verified superadmin/developer.
 */
export async function requireSuperadmin(
  request: NextRequest
): Promise<{ user: AuthenticatedUser } | { response: NextResponse }> {
  const user = await getAuthenticatedAuthority(request);
  if (!user) {
    return {
      response: NextResponse.json(
        { error: 'Unauthorized: Superadmin access required' },
        { status: 401 }
      ),
    };
  }

  if (user.role !== 'superadmin') {
    return {
      response: NextResponse.json(
        { error: 'Forbidden: Insufficient privileges. Only superadmins can access this function.' },
        { status: 403 }
      ),
    };
  }

  return { user };
}
