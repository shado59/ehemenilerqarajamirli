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
    const raw = match[2];
    // URL-encoded ola bilər, əvvəlcə decode et
    const decoded = decodeURIComponent(raw);
    // Base64 decode
    const json = atob(decoded);
    return JSON.parse(json) as AdminSession;
  } catch {
    // İkinci cəhd: birbaşa JSON kimi oxu
    try {
      return JSON.parse(decodeURIComponent(match[2])) as AdminSession;
    } catch {
      return null;
    }
  }
}

export function destroySession(): void {
  if (typeof window !== 'undefined') {
    document.cookie = `${SESSION_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

export function createSession() {}