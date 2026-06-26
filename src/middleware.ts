import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('admin-session');

  // YALNIZ /admin ilə başlayan səhifələri qoru (Login istisna olmaqla)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Bu filtr ana səhifəni və statik faylları qətiyyən görmür
  matcher: ['/admin/:path*'],
};