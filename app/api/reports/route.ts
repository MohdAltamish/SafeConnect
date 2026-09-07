// POST /api/reports — Create a new anonymous report
// Per Architecture.md §2: All student-facing writes go through server-side API routes
// using the Admin SDK, never the client SDK.
//
// PRIVACY (Rules.md §1):
// - No PII is collected or logged
// - The raw access token is NEVER stored or logged — only its hash
// - Server logs must never include description, accessToken, or evidenceUrls content

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { reportSchema } from '@/lib/validators/reportSchema';
import { generateCaseId } from '@/lib/utils/generateCaseId';
import { generateAccessToken, hashAccessToken } from '@/lib/auth/accessToken';
import { routeReport } from '@/lib/routing/routeReport';
import { REPORT_STATUS } from '@/types';
import type { ReportCategory } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod (Rules.md §5: never trust client input)
    const result = reportSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid report data', details: result.error.issues },
        { status: 400 }
      );
    }

    const data = result.data;

    // Generate Case ID and Access Token
    const caseId = generateCaseId();
    const accessToken = generateAccessToken();
    const accessTokenHash = hashAccessToken(accessToken);

    // Route to the correct department (Architecture.md §7)
    const routedTo = routeReport(data.category as ReportCategory);

    // Create the report document
    const now = new Date().toISOString();
    const reportData = {
      caseId,
      accessTokenHash, // NEVER the raw token (Rules.md §1.3)
      category: data.category,
      description: data.description,
      location: data.location || null,
      incidentDate: data.incidentDate || null,
      evidenceUrls: data.evidenceUrls || [],
      routedTo,
      status: REPORT_STATUS.NEW,
      severity: null,
      createdAt: now,
      updatedAt: now,
      closedAt: null,
    };

    await getAdminDb().collection('reports').add(reportData);

    // Log only safe metadata — NEVER log description, token, or evidence
    // (Rules.md §1.7)
    console.log(`[SafeConnect] Report created: caseId=${caseId}, routedTo=${routedTo}`);

    // Return Case ID + raw token to student (shown exactly once)
    return NextResponse.json({
      caseId,
      accessToken, // Shown to student once, then forgotten by the server
    });
  } catch (error) {
    // Safe error logging — no PII, no description, no token
    console.error('[SafeConnect] Error creating report:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Failed to create report. Please try again.' },
      { status: 500 }
    );
  }
}
