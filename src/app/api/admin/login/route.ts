import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, scopeKey } = body;

    const envUsername = process.env.ADMIN_USERNAME || 'admin';
    const envPassword = process.env.ADMIN_PASSWORD || 'RarsKiv2_Secure_Pass_2026';
    const envScopeKey = process.env.SCOPE_KEY;

    // Əgər Vercel-də SCOPE_KEY quraşdırılıbsa yoxla
    if (envScopeKey && scopeKey !== envScopeKey) {
      return NextResponse.json({ error: 'Kritik xəta: Scope Key yanlışdır.' }, { status: 403 });
    }

    if (username !== envUsername || password !== envPassword) {
      return NextResponse.json({ error: 'İstifadəçi adı və ya şifrə səhvdir.' }, { status: 401 });
    }

    // Token yaratmaq (jose Edge Runtime-da tam stabil işləyir)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_key_32_chars_long!!');
    const token = await new SignJWT({ username, role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2h')
      .sign(secret);

    const response = NextResponse.json({ success: true, message: 'Giriş uğurludur' });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7200, // 2 saat
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: 'Server xətası: ' + error.message }, { status: 500 });
  }
}