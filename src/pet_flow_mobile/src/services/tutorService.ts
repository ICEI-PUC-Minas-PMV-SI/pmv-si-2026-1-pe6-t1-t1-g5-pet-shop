import { authStorage } from './auth';

const API_BASE_URL = 'https://pmv-si-2026-1-pe6-t1-t1-g5-pet-shop.onrender.com/api/v1';

export interface Tutor {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  address?: string;
}

export interface CreateTutorPayload {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  address: string;
  clinic_id: string;
}

async function authRequest<T>(endpoint: string, options: RequestInit): Promise<T> {
  const token = await authStorage.getToken();
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
  if (!response.ok) throw new Error(data.error || 'Erro inesperado');
  return data as T;
}

function extractList(payload: unknown): any[] {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === 'object') {
    const s = payload as Record<string, unknown>;
    const nested = s.data ?? s.items ?? s.tutors ?? s.results;
    if (Array.isArray(nested)) return nested;
  }
  return [];
}

export const tutorService = {
  async getAll(): Promise<Tutor[]> {
    const response = await authRequest<unknown>('/tutor', { method: 'GET' });
    return extractList(response).map((raw: any) => ({
      id: raw.id || raw.tutorId || raw.tutor_id || '',
      name: raw.name || raw.tutorName || raw.tutor_name || '',
      cpf: raw.cpf || '',
      phone: raw.phone || '',
      email: raw.email || '',
      address: raw.address || '',
    })).filter(t => t.id !== '');
  },

  create(payload: CreateTutorPayload): Promise<Tutor> {
    return authRequest<Tutor>('/tutor', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update(id: string, payload: CreateTutorPayload): Promise<Tutor> {
    return authRequest<Tutor>(`/tutor/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  delete(id: string): Promise<void> {
    return authRequest<void>(`/tutor/${id}`, { method: 'DELETE' });
  },
};