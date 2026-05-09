import { authStorage } from './auth';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://pmv-si-2026-1-pe6-t1-t1-g5-pet-shop.onrender.com/api/v1';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Tutor {
  id: string;
  name: string;
  cpf: string;
  address: string;
  phone: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Auth request helper ──────────────────────────────────────────────────────
async function authRequest<T>(endpoint: string, options: RequestInit): Promise<T> {
  const token = authStorage.getToken();
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
    throw new Error(data.error || 'Erro inesperado');
  }

  return data as T;
}

// ─── Tutor Service ────────────────────────────────────────────────────────────
export const tutorService = {
  getAll(): Promise<Tutor[]> {
    return authRequest<Tutor[]>('/tutor', { method: 'GET' });
  },
};