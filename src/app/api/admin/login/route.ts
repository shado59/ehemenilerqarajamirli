import { NextRequest, NextResponse } from 'next/server';
import { GitHubService } from '@/lib/github-service';
import { createSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, repository, token, branch } = body;

    if (!username || !repository || !token) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const githubService = new GitHubService({
      username,
      repository,
      token,
      branch: branch || 'main',
    });

    // Test connection
    const connected = await githubService.testConnection();
    if (!connected) {
      return NextResponse.json(
        { error: 'Failed to connect to GitHub repository' },
        { status: 401 }
      );
    }

    // Validate branch
    const branchValid = await githubService.validateBranch();
    if (!branchValid) {
      return NextResponse.json(
        { error: 'Branch not found' },
        { status: 400 }
      );
    }

    // Create session
    createSession({
      username,
      repository,
      token,
      branch: branch || 'main',
      createdAt: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
