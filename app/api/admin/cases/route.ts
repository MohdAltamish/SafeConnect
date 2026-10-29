// GET /api/admin/cases — List cases for authorities & superadmins
// Scoped by authority department (or all cases for superadmin)

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { requireAuthority } from '@/lib/admin/session';
import type { Report, ReportStatus, Severity } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authCheck = await requireAuthority(request);
  if ('response' in authCheck) {
    return authCheck.response;
  }
  const user = authCheck.user;

  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status') as ReportStatus | null;
    const severityFilter = searchParams.get('severity') as Severity | null;
    const searchFilter = searchParams.get('search')?.trim().toUpperCase();

    let reports: Report[] = [];

    // Try live Firestore
    try {
      const db = getAdminDb();
      let query: FirebaseFirestore.Query = db.collection('reports');

      // Superadmin sees all; regular authority sees only their department
      if (user.role !== 'superadmin') {
        query = query.where('routedTo', '==', user.department);
      }

      if (statusFilter) {
        query = query.where('status', '==', statusFilter);
      }

      if (severityFilter) {
        query = query.where('severity', '==', severityFilter);
      }

      const snap = await query.orderBy('createdAt', 'desc').limit(100).get();

      reports = snap.docs.map((doc) => {
        const data = doc.data() as Report;
        return {
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
          accessTokenHash: '', // Omit security token hash
        };
      });
    } catch (dbErr) {
      console.error('[Firestore Query Error]:', dbErr);
      reports = [];
    }

    // Apply client search query filter (Case ID search)
    if (searchFilter) {
      reports = reports.filter((c) => c.caseId.includes(searchFilter));
    }

    // Calculate statutory urgency metrics
    // AICTE 2016 requires committee to convene within 7 days
    const now = Date.now();
    const enrichedReports = reports.map((r) => {
      const createdTime = new Date(r.createdAt).getTime();
      const daysSinceCreation = Math.floor((now - createdTime) / (1000 * 60 * 60 * 24));
      const daysRemainingForMeeting = Math.max(0, 7 - daysSinceCreation);
      const isApproachingMeetingDeadline = r.status === 'NEW' && daysRemainingForMeeting <= 2;

      return {
        ...r,
        daysSinceCreation,
        daysRemainingForMeeting,
        isApproachingMeetingDeadline,
      };
    });

    return NextResponse.json({
      authority: {
        name: user.name,
        email: user.email,
        department: user.department,
        role: user.role,
      },
      reports: enrichedReports,
      cases: enrichedReports,
      totalCount: enrichedReports.length,
    });
  } catch (error) {
    console.error('[SafeConnect Admin Cases] Error fetching cases:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Failed to retrieve cases' }, { status: 500 });
  }
}
