// POST /api/messages — Send a chat message
// Per Architecture.md §2: All access through server-side routes with Admin SDK
// Messages stored with senderRole only — no identity (Rules.md §1)
// Placeholder for Phase 3 (FR6)

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  // Phase 3: Implement message sending with senderRole only
  return NextResponse.json(
    { error: 'Not yet implemented — Phase 3' },
    { status: 501 }
  );
}
