export interface AdminSession {
  username: string;
  repository: string;
  token: string;
  branch: string;
  createdAt: number;
}

const SESSION_COOKIE_NAME = 'admin-session';
const SESSION_MAX_AGE = 24 * 60 * 60 * 1000; // 24 saat

export function createSession(session: AdminSession): void {
  const sessionData = JSON.stringify(session);
  // Azerbaijani hərflərini (ə, ş, ç...) qorumaq üçün Safe Base64 encoding
  const encoded = btoa(unescape(encodeURIComponent(sessionData)));

  if (typeof window !== 'undefined') {
    document.cookie = `${SESSION_COOKIE_NAME}=${encoded}; path=/; max-age=${SESSION_MAX_AGE / 1000}; sameSite=lax`;
  }
}

export function getSession(): AdminSession | null {
  let sessionCookieValue: string | undefined;

  if (typeof window !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )' + SESSION_COOKIE_NAME + '=([^;]+)'));
    if (match) {
      sessionCookieValue = match[2];
    }
  }

  if (!sessionCookieValue) return null;

  try {
    const decoded = decodeURIComponent(escape(atob(sessionCookieValue)));
    const session = JSON.parse(decoded) as AdminSession;

    // Sessiya vaxtı bitibsə sil
    if (Date.now() - session.createdAt > SESSION_MAX_AGE) {
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
    document.cookie = `${SESSION_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
}