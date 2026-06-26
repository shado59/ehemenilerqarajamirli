export interface AdminSession {
  username: string;
  repository: string;
  token: string;
  branch: string;
  createdAt: number;
}

const SESSION_COOKIE_NAME = 'admin-session';

export function getSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;

  const match = document.cookie.match(
    new RegExp('(^| )' + SESSION_COOKIE_NAME + '=([^;]+)')
  );
  if (!match) return null;

  try {
    const decoded = atob(match[2]);
    return JSON.parse(decoded) as AdminSession;
  } catch {
    return null;
  }
}

export function destroySession(): void {
  if (typeof window !== 'undefined') {
    document.cookie = `${SESSION_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

export function createSession() {}