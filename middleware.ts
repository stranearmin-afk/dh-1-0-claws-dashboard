import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';

export async function middleware(request: NextRequest) {
  // Allow public access to login and auth routes
  if (request.nextUrl.pathname.startsWith('/auth') || request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // For now, allow all dashboard access (remove this in production)
  if (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};