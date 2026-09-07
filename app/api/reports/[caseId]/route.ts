// GET/PATCH /api/reports/[caseId] — Get or update a report
// Per Architecture.md §2: All access through server-side routes with Admin SDK
// Requires token verification for student access
// Placeholder for Phase 3 (FR5)

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Phase 3: Implement token verification + report retrieval
  return NextResponse.json(
    { error: 'Not yet implemented — Phase 3' },
    { status: 501 }
  );
}

export async function PATCH() {
  // Phase 4: Implement status updates by authority
  return NextResponse.json(
    { error: 'Not yet implemented — Phase 4' },
    { status: 501 }
  );
}
