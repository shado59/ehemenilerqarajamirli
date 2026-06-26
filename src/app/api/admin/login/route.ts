import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Şəkildəki input adlarına uyğun dəyişənlər
    const { githubUsername, repositoryName, branch, githubToken } = body;

    if (!githubUsername || !repositoryName || !branch || !githubToken) {
      return NextResponse.json({ error: 'Bütün xanaları doldurun.' }, { status: 400 });
    }

    // GitHub API vasitəsilə verilən Token-in və Repozitoriyanın doğruluğunu yoxlayırıq
    const githubApiUrl = `https://api.github.com/repos/${githubUsername}/${repositoryName}/branches/${branch}`;
    
    const ghResponse = await fetch(githubApiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Nextjs-Admin-Panel'
      },
      // Cache-i bağlayırıq ki, anlıq yoxlasın
      cache: 'no-store'
    });

    if (!ghResponse.ok) {
      return NextResponse.json({ 
        error: 'GitHub doğrulaması uğursuz oldu. Məlumatları və ya Token icazələrini (repo scope) yoxlayın.' 
      }, { status: 401 });
    }

    // Əgər GitHub repoya girişi təsdiqlədisə, sessiya yaradırıq
    const response = NextResponse.json({ success: true, message: 'GitHub bağlantısı uğurludur.' });

    // Brauzerdə admin sessiyasını saxlayırıq
    response.cookies.set('admin_token', 'gh_authenticated_session', {
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