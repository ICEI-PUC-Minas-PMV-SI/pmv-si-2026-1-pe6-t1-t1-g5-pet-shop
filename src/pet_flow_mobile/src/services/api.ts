import { publicRequest } from './http';
import type { AuthResponse } from '../types';

export const authService = {
  login(email: string, password: string): Promise<AuthResponse> {
    return publicRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register(payload: Record<string, unknown>): Promise<AuthResponse> {
    return publicRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  refresh(refreshToken: string): Promise<AuthResponse> {
    return publicRequest<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  },
};
