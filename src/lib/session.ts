export interface AdminSession {
  username: string;
  repository: string;
  token: string;
  branch: string;
  createdAt: number;
}

const SESSION_COOKIE_NAME = 'admin-session';
const SESSION_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

function decodeBase64(str: string): string {
  if (typeof window !== 'undefined') {
    return decodeURIComponent(escape(atob(str)));
  } else {
    return Buffer.from(str, 'base64').toString('utf-8');
  }
}

function encodeBase64(str: string): string {
  if (typeof window !== 'undefined') {
    return btoa(unescape(encodeURIComponent(str)));
  } else {
    return Buffer.from(str).toString('base64');
  }
}

export function createSession(session: AdminSession): void {
  const sessionData = JSON.stringify(session);
  const encoded = encodeBase64(sessionData);

  if (typeof window !== 'undefined') {
    // Client-side cookie setting
    document.cookie = `${SESSION_COOKIE_NAME}=${encoded}; path=/; max-age=${SESSION_MAX_AGE / 1000}; sameSite=lax`;
  } else {
    // Server-side cookie setting
    try {
      const { cookies } = require('next/headers');
      cookies().set(SESSION_COOKIE_NAME, encoded, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: SESSION_MAX_AGE / 1000,
        path: '/',
      });
    } catch (e) {
      console.error('Failed to set cookie on server:', e);
    }
  }
}

export function getSession(): AdminSession | null {
  let sessionCookieValue: string | undefined;

  if (typeof window !== 'undefined') {
    // Client-side cookie reading
    const match = document.cookie.match(new RegExp('(^| )' + SESSION_COOKIE_NAME + '=([^;]+)'));
    if (match) {
      sessionCookieValue = match[2];
    }
  } else {
    // Server-side cookie reading
    try {
      const { cookies } = require('next/headers');
      sessionCookieValue = cookies().get(SESSION_COOKIE_NAME)?.value;
    } catch (e) {
      // Normal when not in request context
    }
  }

  // If no session cookie exists, return a local mock session to bypass login screen
  if (!sessionCookieValue) {
    return {
      username: 'local-admin',
      repository: 'local-repo',
      token: 'local',
      branch: 'main',
      createdAt: Date.now(),
    };
  }

  try {
    const decoded = decodeBase64(sessionCookieValue);
    const session = JSON.parse(decoded) as AdminSession;

    // Check session age
    const age = Date.now() - session.createdAt;
    if (age > SESSION_MAX_AGE) {
      destroySession();
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function destroySession(): void {
  if (typeof window !== 'undefined') {
    document.cookie = `${SESSION_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  } else {
    try {
      const { cookies } = require('next/headers');
      cookies().delete(SESSION_COOKIE_NAME);
    } catch (e) {
      console.error('Failed to delete cookie on server:', e);
    }
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

