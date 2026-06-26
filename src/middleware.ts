import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Next.js daxili resurslarını, statik faylları və şəkilləri yoxlamadan keçir
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api/public') ||
    pathname.includes('.') // favicon.ico, şəkillər və s.
  ) {
    return NextResponse.next();
  }

  // 2. CRITICAL: Əgər link /admin və ya /api/admin ilə BAŞLAMIYORSA, tam sərbəst burax (Ana səhifə və s.)
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
    return NextResponse.next();
  }

  // 3. Admin login səhifəsinə və login API marşrutuna giriş izni ver
  if (pathname === '/admin/login' || pathname === '/api/admin/login') {
    return NextResponse.next();
  }

  // 4. Qorunan admin panel səhifələri üçün token yoxlanışı
  const token = request.cookies.get('admin_token')?.value;

  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

// Yalnız lazımi marşrutları filterləmək üçün matcher
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};