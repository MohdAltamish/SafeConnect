// GET/POST/PATCH /api/admin/developer/users — Authority provisioning & access control
// Superadmin / Developer access only

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, getAdminAuth } from '@/lib/firebase/admin';
import { requireSuperadmin } from '@/lib/admin/session';
import { provisionAuthoritySchema } from '@/lib/validators/adminSchemas';
import { recordAuditLog } from '@/lib/admin/audit';
import type { Authority, Department, AuthorityRole } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authCheck = await requireSuperadmin(request);
  if ('response' in authCheck) {
    return authCheck.response;
  }

  try {
    const db = getAdminDb();
    const snap = await db.collection('authorities').get();

    const users: Authority[] = snap.docs.map((d) => {
      const data = d.data();
      return {
        uid: d.id,
        name: data.name,
        email: data.email,
        department: data.department as Department,
        role: data.role as AuthorityRole,
        active: data.active ?? true,
      };
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('[SafeConnect Admin Users] Error listing users:', error);
    return NextResponse.json({ error: 'Failed to list authorities' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await requireSuperadmin(request);
  if ('response' in authCheck) {
    return authCheck.response;
  }
  const adminUser = authCheck.user;

  try {
    const body = await request.json();
    const result = provisionAuthoritySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid authority payload', details: result.error.issues },
        { status: 400 }
      );
    }

    const { email, name, department, role, active } = result.data;
    const db = getAdminDb();
    const adminAuth = getAdminAuth();

    // Check if Firebase Auth user exists, or create placeholder
    let targetUid: string;
    try {
      const existingUser = await adminAuth.getUserByEmail(email);
      targetUid = existingUser.uid;
    } catch {
      // Create user in Firebase Auth if not already existing
      const newUser = await adminAuth.createUser({
        email,
        displayName: name,
        emailVerified: true,
      });
      targetUid = newUser.uid;
    }

    // Set custom claims
    await adminAuth.setCustomUserClaims(targetUid, {
      role,
      department,
    });

    // Save to Firestore authorities collection
    const authorityRecord: Authority = {
      uid: targetUid,
      email,
      name,
      department: department as Department,
      role: role as AuthorityRole,
      active: active ?? true,
    };

    await db.collection('authorities').doc(targetUid).set(authorityRecord);

    // Record audit log
    await recordAuditLog({
      action: 'PROVISION_AUTHORITY_ACCOUNT',
      performedByUid: adminUser.uid,
      reportId: 'SYSTEM',
      details: { email, department, role },
    });

    return NextResponse.json({ success: true, user: authorityRecord });
  } catch (error) {
    console.error('[SafeConnect Provision User] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to provision user' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const authCheck = await requireSuperadmin(request);
  if ('response' in authCheck) {
    return authCheck.response;
  }
  const adminUser = authCheck.user;

  try {
    const body = await request.json();
    const { uid, active, role, department } = body;

    if (!uid) {
      return NextResponse.json({ error: 'User UID is required' }, { status: 400 });
    }

    const db = getAdminDb();
    const docRef = db.collection('authorities').doc(uid);
    const snap = await docRef.get();

    if (!snap.exists) {
      return NextResponse.json({ error: 'Authority user not found' }, { status: 404 });
    }

    const updates: Record<string, unknown> = {};
    if (typeof active === 'boolean') updates.active = active;
    if (role) updates.role = role;
    if (department) updates.department = department;

    await docRef.update(updates);

    // If deactivating, revoke Firebase refresh tokens immediately
    if (active === false) {
      try {
        await getAdminAuth().revokeRefreshTokens(uid);
      } catch (err) {
        console.warn('[SafeConnect Revoke Tokens] Warning:', err);
      }
    }

    // Record audit log
    await recordAuditLog({
      action: active === false ? 'REVOKE_AUTHORITY_ACCESS' : 'UPDATE_AUTHORITY_PROFILE',
      performedByUid: adminUser.uid,
      reportId: 'SYSTEM',
      details: { targetUid: uid, updates },
    });

    return NextResponse.json({ success: true, message: 'Authority access updated' });
  } catch (error) {
    console.error('[SafeConnect Update User] Error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
