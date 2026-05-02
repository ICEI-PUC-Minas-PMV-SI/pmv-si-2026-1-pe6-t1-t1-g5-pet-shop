import { authService, type AuthResponse } from './api';

const TOKEN_KEY = 'petflow_token';
const REFRESH_TOKEN_KEY = 'petflow_refresh_token';
const USER_ID_KEY = 'petflow_user_id';
const REMEMBER_KEY = 'petflow_remember';
const LOGIN_TIME_KEY = 'petflow_login_time';

const SESSION_DURATION_MS = 60 * 60 * 1000; // 1 hora

const ALL_KEYS = [TOKEN_KEY, REFRESH_TOKEN_KEY, USER_ID_KEY, LOGIN_TIME_KEY];

function getStorage(): Storage {
  return localStorage.getItem(REMEMBER_KEY) === 'true'
    ? localStorage
    : sessionStorage;
}

function readKey(key: string): string | null {
  return localStorage.getItem(key) || sessionStorage.getItem(key);
}

function clearAll(): void {
  for (const key of [...ALL_KEYS, REMEMBER_KEY]) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }
}

export const authStorage = {
  save(data: AuthResponse, remember: boolean): void {
    clearAll();

    const storage = remember ? localStorage : sessionStorage;

    if (remember) {
      localStorage.setItem(REMEMBER_KEY, 'true');
    }

    storage.setItem(TOKEN_KEY, data.token);
    storage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
    storage.setItem(USER_ID_KEY, data.user_id);
    storage.setItem(LOGIN_TIME_KEY, Date.now().toString());
  },

  getToken(): string | null {
    return readKey(TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    return readKey(REFRESH_TOKEN_KEY);
  },

  getUserId(): string | null {
    return readKey(USER_ID_KEY);
  },

  isExpired(): boolean {
    const loginTime = readKey(LOGIN_TIME_KEY);
    if (!loginTime) return true;
    return Date.now() - Number(loginTime) > SESSION_DURATION_MS;
  },

  isAuthenticated(): boolean {
    if (!this.getToken()) return false;
    // Token existe mas não expirou — ok
    if (!this.isExpired()) return true;
    // Expirou mas tem refresh token — tentará refresh
    if (this.getRefreshToken()) return true;
    // Sem nada, limpa
    this.clear();
    return false;
  },

  async tryRefresh(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const data = await authService.refresh(refreshToken);
      const remember = localStorage.getItem(REMEMBER_KEY) === 'true';
      this.save(data, remember);
      return true;
    } catch {
      this.clear();
      return false;
    }
  },

  clear: clearAll,
};
