// POST /api/admin/developer/repair — Database integrity repair & self-healing
// Superadmin / Developer access only

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { requireSuperadmin } from '@/lib/admin/session';
import { routeReport } from '@/lib/routing/routeReport';
import { recordAuditLog } from '@/lib/admin/audit';
import type { ReportCategory } from '@/types';

export const dynamic = 'force-dynamic';

const STAGING_MOCK_CASES = [
  {
    caseId: 'SC-7X9K2',
    category: 'SEXUAL_HARASSMENT',
    description: 'Incident near Central Library during evening study hours.',
    location: 'Central Library, Ground Floor',
    incidentDate: new Date(Date.now() - 3600000 * 48).toISOString(),
    evidenceUrls: [],
    routedTo: 'INTERNAL_COMMITTEE',
    status: 'NEW',
    severity: 'HIGH',
    isStaging: true,
  },
  {
    caseId: 'SC-8F2A1',
    category: 'STALKING',
    description: 'Repeated stalking observed along the pathway to Girls Hostel 2.',
    location: 'Path near Girls Hostel 2',
    incidentDate: new Date(Date.now() - 3600000 * 72).toISOString(),
    evidenceUrls: [],
    routedTo: 'INTERNAL_COMMITTEE',
    status: 'UNDER_REVIEW',
    severity: 'HIGH',
    isStaging: true,
  },
  {
    caseId: 'SC-3M4P9',
    category: 'HOSTEL_ISSUE',
    description: 'Water supply harassment and curfew dispute in Boys Hostel 1.',
    location: 'Boys Hostel 1, Wing B',
    incidentDate: new Date(Date.now() - 3600000 * 96).toISOString(),
    evidenceUrls: [],
    routedTo: 'WARDEN',
    status: 'ACTION_TAKEN',
    severity: 'MEDIUM',
    isStaging: true,
  },
  {
    caseId: 'SC-9K4L2',
    category: 'RAGGING',
    description: 'First year students forced into physical tasks outside cafeteria.',
    location: 'Cafeteria Lawn',
    incidentDate: new Date(Date.now() - 3600000 * 24).toISOString(),
    evidenceUrls: [],
    routedTo: 'ANTI_RAGGING_CELL',
    status: 'NEW',
    severity: 'HIGH',
    isStaging: true,
  },
  {
    caseId: 'SC-2B5C8',
    category: 'CYBERBULLYING',
    description: 'Harassing messages circulated on student WhatsApp groups.',
    location: 'Online / Campus Wi-Fi',
    incidentDate: new Date(Date.now() - 3600000 * 120).toISOString(),
    evidenceUrls: [],
    routedTo: 'DISCIPLINE_COMMITTEE',
    status: 'CLOSED',
    severity: 'LOW',
    isStaging: true,
  },
];

export async function POST(request: NextRequest) {
  const authCheck = await requireSuperadmin(request);
  if ('response' in authCheck) {
    return authCheck.response;
  }
  const user = authCheck.user;

  try {
    let action = 'REPAIR_UNROUTED';
    try {
      const body = await request.json();
      if (body?.action) action = body.action;
    } catch {
      // default to REPAIR_UNROUTED if no body
    }

    const db = getAdminDb();
    const reportsRef = db.collection('reports');

    // ── ACTION: SEED STAGING ──
    if (action === 'SEED_STAGING') {
      const seeded: string[] = [];
      const now = new Date().toISOString();

      for (const mock of STAGING_MOCK_CASES) {
        const docRef = reportsRef.doc(`mock-${mock.caseId}`);
        await docRef.set({
          ...mock,
          accessTokenHash: 'staging-mock-hash-preview',
          createdAt: mock.incidentDate,
          updatedAt: now,
          closedAt: mock.status === 'CLOSED' ? now : null,
        });

        // Add demo message
        await docRef.collection('messages').doc('msg-init').set({
          senderRole: 'student',
          text: `Grievance registered under ${mock.category}. Awaiting statutory committee action.`,
          createdAt: mock.incidentDate,
        });

        seeded.push(mock.caseId);
      }

      await recordAuditLog({
        action: 'SEED_STAGING_CASES',
        performedByUid: user.uid,
        reportId: 'SYSTEM',
        details: { count: seeded.length, cases: seeded },
      });

      return NextResponse.json({
        success: true,
        message: `Successfully seeded ${seeded.length} realistic training cases with chat threads into Firestore.`,
        cases: seeded,
      });
    }

    // ── ACTION: PURGE STAGING ──
    if (action === 'PURGE_STAGING') {
      const stagingSnap = await reportsRef.where('isStaging', '==', true).get();
      let purgedCount = 0;

      for (const doc of stagingSnap.docs) {
        // Delete messages subcollection
        const msgSnap = await doc.ref.collection('messages').get();
        for (const m of msgSnap.docs) {
          await m.ref.delete();
        }
        await doc.ref.delete();
        purgedCount++;
      }

      await recordAuditLog({
        action: 'PURGE_STAGING_CASES',
        performedByUid: user.uid,
        reportId: 'SYSTEM',
        details: { count: purgedCount },
      });

      return NextResponse.json({
        success: true,
        message: `Purged ${purgedCount} mock staging cases from Firestore without touching production cases.`,
      });
    }

    // ── ACTION: REPAIR UNROUTED ──
    const unroutedSnap = await reportsRef.where('routedTo', '==', null).limit(50).get();
    const repairedCases: Array<{ caseId: string; category: string; routedTo: string }> = [];

    for (const doc of unroutedSnap.docs) {
      const data = doc.data();
      const correctDept = routeReport(data.category as ReportCategory);

      await doc.ref.update({
        routedTo: correctDept,
        updatedAt: new Date().toISOString(),
      });

      repairedCases.push({
        caseId: data.caseId,
        category: data.category,
        routedTo: correctDept,
      });
    }

    await recordAuditLog({
      action: 'DATABASE_SELF_HEALING_REPAIR',
      performedByUid: user.uid,
      reportId: 'SYSTEM',
      details: {
        repairedCount: repairedCases.length,
        cases: repairedCases.map((c) => c.caseId),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Self-healing routine completed. Repaired ${repairedCases.length} unrouted cases.`,
      repairedCount: repairedCases.length,
      repairedCases,
    });
  } catch (error) {
    console.error('[SafeConnect DB Repair] Error:', error);
    return NextResponse.json({ error: 'Database repair routine failed' }, { status: 500 });
  }
}
