export type SessionUser = {
  email: string;
  role: "manager" | "developer";
  name: string;
  githubId?: string;
  githubUsername?: string;
  githubToken?: string;
  githubAvatarUrl?: string;
};

export type RegisteredUser = {
  email: string;
  password: string;
  name: string;
  role: "manager" | "developer";
};

const SESSION_COOKIE = "xcode.user_info";

export function readSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(new RegExp('(^| )' + SESSION_COOKIE + '=([^;]+)'));
  if (match) {
    try {
      return JSON.parse(decodeURIComponent(match[2])) as SessionUser;
    } catch (e) {
      return null;
    }
  }
  return null;
}

export function saveSession(session: SessionUser) {
  if (typeof window === "undefined") return;
  const value = encodeURIComponent(JSON.stringify(session));
  document.cookie = `${SESSION_COOKIE}=${value}; path=/; max-age=86400; samesite=lax`;
}

export function clearSession() {
  if (typeof window === "undefined") return;
  document.cookie = `${SESSION_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
