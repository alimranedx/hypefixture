import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin routes, but allow /admin/login and /admin/register
  if (
    pathname.startsWith('/admin') &&
    !pathname.startsWith('/admin/login') &&
    !pathname.startsWith('/admin/register')
  ) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || 'hypefixture_secure_nextauth_secret_key_2026',
    });

    const userRole = token?.role;

    // If not authenticated or not an admin, immediately redirect to /admin/login
    if (!token || (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN')) {
      const loginUrl = new URL('/admin/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
