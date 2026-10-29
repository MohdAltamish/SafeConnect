// POST /api/admin/auth/logout — Invalidate admin session

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

  // Clear all admin auth cookies
  response.cookies.delete('__session');
  response.cookies.delete('__dev_verified');
  response.cookies.delete('__dev_mock');

  return response;
}
