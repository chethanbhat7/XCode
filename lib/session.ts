export type SessionUser = {
  email: string;
  role: "manager" | "developer";
  name: string;
};

export type RegisteredUser = {
  email: string;
  password: string;
  name: string;
  role: "manager" | "developer";
};

const SESSION_KEY = "xcode.session";
const USERS_KEY = "xcode.users";

export function readSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as SessionUser) : null;
}

export function saveSession(session: SessionUser) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

function readUsers(): RegisteredUser[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(USERS_KEY);
  return raw ? (JSON.parse(raw) as RegisteredUser[]) : [];
}

function writeUsers(users: RegisteredUser[]) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function findUserByEmail(email: string): RegisteredUser | null {
  const users = readUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function registerUser(user: RegisteredUser): { ok: boolean; error?: string } {
  const users = readUsers();
  if (users.find((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
    return { ok: false, error: "User already exists" };
  }
  users.push(user);
  writeUsers(users);
  return { ok: true };
}

export function validateCredentials(email: string, password: string): RegisteredUser | null {
  const user = findUserByEmail(email);
  if (!user) return null;
  return user.password === password ? user : null;
}
