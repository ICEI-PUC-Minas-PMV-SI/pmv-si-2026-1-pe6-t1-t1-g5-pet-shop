import { authService, type AuthResponse } from './api';

const TOKEN_KEY = 'petflow_token';
const REFRESH_TOKEN_KEY = 'petflow_refresh_token';
const USER_ID_KEY = 'petflow_user_id';
const REMEMBER_KEY = 'petflow_remember';
const LOGIN_TIME_KEY = 'petflow_login_time';
const SESSION_DATA_KEY = 'petflow_session_data';

const SESSION_DURATION_MS = 60 * 60 * 1000;

const ALL_KEYS = [TOKEN_KEY, REFRESH_TOKEN_KEY, USER_ID_KEY, LOGIN_TIME_KEY, SESSION_DATA_KEY];

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://pmv-si-2026-1-pe6-t1-t1-g5-pet-shop.onrender.com/api/v1';

function readKey(key: string): string | null {
  return localStorage.getItem(key) || sessionStorage.getItem(key);
}

function clearAll(): void {
  for (const key of [...ALL_KEYS, REMEMBER_KEY]) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }
}

export async function authRequest<T>(endpoint: string, options: RequestInit): Promise<T> {
  const token = readKey(TOKEN_KEY);
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (response.status === 204) return null as T;

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Erro inesperado');
  }

  return data as T;
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


    const sessionData = {
      id: data.user_id,
      clinic_id: data.clinic_id || (data as any).user?.clinic_id || '',
      email: (data as any).email || ''
    };
    
    storage.setItem(SESSION_DATA_KEY, JSON.stringify(sessionData));
  },

  getUser(): any {
    const data = readKey(SESSION_DATA_KEY);
    return data ? JSON.parse(data) : null;
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
    if (!this.isExpired()) return true;
    if (this.getRefreshToken()) return true;
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