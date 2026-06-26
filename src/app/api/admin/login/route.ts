import { NextRequest, NextResponse } from 'next/server';
import { GitHubService } from '@/lib/github-service';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, repository, token, branch } = body;

    const githubService = new GitHubService({
      username,
      repository,
      token,
      branch: branch || 'main',
    });

    const connected = await githubService.testConnection();
    if (!connected) {
      return NextResponse.json({ error: 'GitHub bağlantısı uğursuz oldu' }, { status: 401 });
    }

    const branchValid = await githubService.validateBranch();
    if (!branchValid) {
      return NextResponse.json({ error: 'Branch tapılmadı' }, { status: 400 });
    }

    // SESSİYA MƏLUMATINI HAZIRLA
    const sessionData = JSON.stringify({ username, repository, token, branch: branch || 'main', createdAt: Date.now() });
    const encodedSession = Buffer.from(sessionData).toString('base64');

    // KÜKİNİ SERVERDƏ YARAT (ƏN ETİBARLI YOL)
    cookies().set('admin-session', encodedSession, {
      httpOnly: true, // Təhlükəsizlik üçün
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 saat
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 });
  }
}