import { NextRequest, NextResponse } from 'next/server';
import { GitHubService } from '@/lib/github-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, repository, token, branch } = body;

    if (!username || !repository || !token) {
      return NextResponse.json({ error: 'Məlumatlar əskikdir' }, { status: 400 });
    }

    const githubService = new GitHubService({
      username,
      repository,
      token,
      branch: branch || 'main',
    });

    // 1. GitHub ilə bağlantını yoxla
    const connected = await githubService.testConnection();
    if (!connected) {
      return NextResponse.json({ error: 'GitHub bağlantısı uğursuz oldu (Token və ya User səhvdir)' }, { status: 401 });
    }

    // 2. Branch-ı yoxla
    const branchValid = await githubService.validateBranch();
    if (!branchValid) {
      return NextResponse.json({ error: 'Göstərilən Branch tapılmadı' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Daxili server xətası' }, { status: 500 });
  }
}