import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Exclude static assets and api routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Mock reading a token/session
  // In a real scenario, you might read an actual jwt or session cookie here
  const token = request.cookies.get('auth-token')?.value;
  const userRole = request.cookies.get('user-role')?.value; // e.g. "paciente", "medico", "admin", "superadmin"

  const isAuthenticated = !!token && !!userRole;

  // Public routes mapping based on (public) group or landing pages
  const isPublicRoute = pathname === '/' || pathname === '/login' || pathname === '/register' || pathname === '/privacy-policy' || pathname === '/terms';

  // 1. Unauthenticated users trying to access dashboard routes go to /login
  if (!isAuthenticated) {
    if (!isPublicRoute) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2. Authenticated users
  if (isAuthenticated) {
    // If accessing public routes while authenticated, redirect to their dashboard
    if (pathname === '/login' || pathname === '/register' || pathname === '/') {
      const redirectUrl = userRole === 'superadmin' ? '/admin' : `/${userRole}`;
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // Role-based authorization
    if (userRole === 'superadmin') {
      // 5. superadmin has access to everything
      return NextResponse.next();
    }

    // If accessing a dashboard path that does not start with their role
    // e.g. paciente accessing /admin or /medico
    if (pathname.startsWith('/') && pathname !== `/${userRole}` && !pathname.startsWith(`/${userRole}/`)) {
      // 4. If a 'paciente' (or anyone) attempts to access another dashboard, redirect to their own
      return NextResponse.redirect(new URL(`/${userRole}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
