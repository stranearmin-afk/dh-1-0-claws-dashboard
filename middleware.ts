import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow auth routes
  if (pathname.startsWith('/auth') || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Protect /fleetlink — require authenticated session
  if (pathname.startsWith('/fleetlink')) {
    const session = await getIronSession<SessionData>(request.cookies, sessionOptions);
    if (!session.user?.authenticated) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};