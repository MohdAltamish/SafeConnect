// Next.js Edge Middleware — Route guard for /admin routes
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard /admin routes
  if (pathname.startsWith('/admin')) {
    // Public authority login page
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    const sessionCookie = request.cookies.get('__session')?.value;
    const devMock = request.cookies.get('__dev_mock')?.value;
    const hasAuth = !!sessionCookie || !!devMock;

    // Redirect unauthenticated requests to login
    if (!hasAuth) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Developer rescue panel requires verified superadmin cookie
    if (pathname.startsWith('/admin/developer')) {
      const devVerified = request.cookies.get('__dev_verified')?.value;
      const isSuperadmin = devVerified === 'true' || devMock === 'superadmin';

      if (!isSuperadmin) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
