import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. LOGIN SƏHİFƏSİNƏ HƏR ZAMAN İCAZƏ VER
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // 2. YALNIZ /ADMIN İLƏ BAŞLAYAN YOLLARI YOXLA
  if (pathname.startsWith('/admin')) {
    const session = request.cookies.get('admin-session');
    
    // Əgər sessiya yoxdursa, login səhifəsinə yönləndir
    if (!session) {
      const url = new URL('/admin/login', request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// BU HİSSƏ ÇOX VACİBDİR: ANA SƏHİFƏ VƏ DİGƏR STATİK FAYLLARI BURADAN KƏNAR TUTURUQ
export const config = {
  matcher: ['/admin/:path*'],
};