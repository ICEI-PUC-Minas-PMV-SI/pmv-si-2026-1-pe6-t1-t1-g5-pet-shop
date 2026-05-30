import { storage } from './storage';
import { STORAGE_KEYS } from '../constants';
import type { AuthResponse, SessionData } from '../types';
import { authService } from './api';

export const authStorage = {
  async save(data: AuthResponse): Promise<void> {
    await storage.multiSet([
      [STORAGE_KEYS.TOKEN, data.token],
      [STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token],
      [STORAGE_KEYS.USER_ID, data.user_id],
    ]);
  },

  async getToken(): Promise<string | null> {
    return storage.get(STORAGE_KEYS.TOKEN);
  },

  async getUserId(): Promise<string | null> {
    return storage.get(STORAGE_KEYS.USER_ID);
  },

  async getSessionData(): Promise<SessionData | null> {
    return storage.getJSON<SessionData>(STORAGE_KEYS.SESSION_DATA);
  },

  async saveSessionData(data: SessionData): Promise<void> {
    await storage.setJSON(STORAGE_KEYS.SESSION_DATA, data);
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await storage.get(STORAGE_KEYS.TOKEN);
    return !!token;
  },

  async tryRefresh(): Promise<boolean> {
    const refreshToken = await storage.get(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) return false;

    try {
      const data = await authService.refresh(refreshToken);
      await this.save(data);
      return true;
    } catch {
      await this.clear();
      return false;
    }
  },

  async clear(): Promise<void> {
    await storage.multiRemove([
      STORAGE_KEYS.TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_ID,
      STORAGE_KEYS.SESSION_DATA,
    ]);
  },
};
