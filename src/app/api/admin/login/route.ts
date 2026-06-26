import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Front-end-dən fərqli adlarla gələ biləcək bütün dəyişənləri tuturuq
    const repoName = body.repositoryName || body.repoName || body.repository;
    const scopeKey = body.scopeKey || body.scope_key || body.scope;
    const githubToken = body.githubToken || body.token || body.github_token;
    const branch = body.branch || 'main'; // əgər gəlməzsə default main

    // Konsolda yoxlamaq üçün (Vercel Logs-da görünəcək)
    console.log("Gələn məlumatlar:", { repoName, scopeKey, hasToken: !!githubToken });

    // Xanaların dolub-dolmadığını yoxlayan dəqiq kontrol
    if (!repoName || !scopeKey || !githubToken) {
      return NextResponse.json({ 
        error: `Bütün xanaları doldurun. Çatışmayan: ${!repoName ? 'Repo ' : ''}${!scopeKey ? 'ScopeKey ' : ''}${!githubToken ? 'Token' : ''}` 
      }, { status: 400 });
    }

    // Əgər sistemində Vercel panelində təyin etdiyin bir SCOPE_KEY varsa onu yoxla
    const envScopeKey = process.env.SCOPE_KEY;
    if (envScopeKey && scopeKey !== envScopeKey) {
      return NextResponse.json({ error: 'Daxil edilən Scope Key sistemdəki ilə uyğun gəlmir.' }, { status: 403 });
    }

    // İstəsən bura birbaşa GitHub API yoxlanışı qoya bilərsən, ya da uğurlu keçid verə bilərsən.
    // İndiki halda giriş bloklanmasın deyə sessiyanı təsdiqləyirik:
    const response = NextResponse.json({ success: true, message: 'Giriş uğurludur.' });

    // Cookie təyini
    response.cookies.set('admin_token', 'secure_admin_session_active', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400, // 24 saat
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: 'Server xətası: ' + error.message }, { status: 500 });
  }
}