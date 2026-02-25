/**
 * authStorage - servicio para persistencia de autenticacion.
 */

import type { AuthSessionUser } from '../../types/user.types';

const USER_EMAIL_KEY = 'softkify_user_email';
const TOKEN_KEY = 'softkify_auth_token';
const SESSION_KEY = 'softkify_auth_session';

interface StoredSession {
  userId: string;
  email: string;
  name?: string;
  role?: string;
}

const parseSession = (rawValue: string | null): StoredSession | null => {
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as StoredSession;
    if (!parsed.userId || !parsed.email) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const authStorage = {
  saveSession(user: AuthSessionUser): void {
    const session: StoredSession = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(USER_EMAIL_KEY, user.email);
  },

  getSession(): AuthSessionUser | null {
    const session = parseSession(localStorage.getItem(SESSION_KEY));
    if (!session) {
      return null;
    }

    return {
      id: session.userId,
      email: session.email,
      name: session.name,
      role: session.role,
    };
  },

  clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },

  // Legacy helpers kept for compatibility.
  saveUserEmail(email: string): void {
    localStorage.setItem(USER_EMAIL_KEY, email);
  },

  getUserEmail(): string | null {
    return localStorage.getItem(USER_EMAIL_KEY);
  },

  clearUserEmail(): void {
    localStorage.removeItem(USER_EMAIL_KEY);
  },

  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },
};
