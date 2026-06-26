import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const username  = body.username  || '';
    const repository = body.repository || body.repositoryName || body.repoName || '';
    const token     = body.token     || body.githubToken || '';
    const branch    = body.branch    || 'main';

    if (!username || !repository || !token) {
      return NextResponse.json({
        error: `Bütün xanaları doldurun. Çatışmayan: ${!username ? 'Username ' : ''}${!repository ? 'Repository ' : ''}${!token ? 'Token' : ''}`
      }, { status: 400 });
    }

    // GitHub-la real bağlantı yoxlaması
    const githubCheck = await fetch(
      `https://api.github.com/repos/${username}/${repository}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
        },
      }
    );

    if (!githubCheck.ok) {
      return NextResponse.json({
        error: 'GitHub məlumatları yanlışdır. Username, repository adı və ya token-i yoxlayın.'
      }, { status: 401 });
    }

    // Sessiya məlumatlarını base64 JSON olaraq cookie-yə yaz
    const sessionData = JSON.stringify({ username, repository, token, branch, createdAt: Date.now() });
    const encoded = Buffer.from(sessionData).toString('base64');

    const response = NextResponse.json({ success: true, message: 'Giriş uğurludur.' });

    // ÖNƏMLİ: Cookie adı session.ts ilə eyni olmalıdır: "admin-session"
    response.cookies.set('admin-session', encoded, {
      httpOnly: false,
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