import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('admin-session');

  if (pathname.startsWith('/admin')) {
    // Login səhifəsinə hər zaman icazə ver
    if (pathname === '/admin/login') return NextResponse.next();
    
    // Sessiya yoxdursa login-ə yönləndir
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};