import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // CRITICAL FIX: Əgər daxil olunan səhifə /admin ilə başlamırsa,
  // bu normal istifadəçidir. Heç bir yoxlama etmə, birbaşa saytı aç.
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
    return NextResponse.next();
  }

  // Admin panelin login səhifəsinə və login API-na hamı girə bilsin
  if (pathname === '/admin/login' || pathname === '/api/admin/login') {
    return NextResponse.next();
  }

  // YALNIZ /admin qorunan hissələr üçün token yoxlanışı
  const token = request.cookies.get('admin_token')?.value;

  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_key_32_chars_long!!');
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (err) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.delete('admin_token');
    return response;
  }
}

// Middleware-in hansı linklərdə işə düşəcəyini təyin edirik
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};