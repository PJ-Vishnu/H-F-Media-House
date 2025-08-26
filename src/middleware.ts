import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('user-token')?.value;
  const { pathname } = req.nextUrl;

  const isVerified = token && (await verifyAuth(token));

  // If trying to access login page while logged in, redirect to dashboard
  if (pathname.startsWith('/login') && isVerified) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }

  // If trying to access admin pages while not logged in, redirect to login
  if (pathname.startsWith('/admin') && !isVerified) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
