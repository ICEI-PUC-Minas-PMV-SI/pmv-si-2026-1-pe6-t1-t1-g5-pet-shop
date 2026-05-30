import { authStorage } from './auth';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://pmv-si-2026-1-pe6-t1-t1-g5-pet-shop.onrender.com/api/v1';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Vaccine {
  id: string;
  name: string;
  date: string;
  petId: string;
}

export interface CreateVaccinePayload {
  name: string;
  date: string;
  petId: string;
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

// ─── Vaccine Service ──────────────────────────────────────────────────────────
export const vaccineService = {
  getByPet(petId: string): Promise<Vaccine[]> {
    return authRequest<Vaccine[]>(`/vaccine/pet/${petId}`, { method: 'GET' });
  },

  create(payload: CreateVaccinePayload): Promise<Vaccine> {
    return authRequest<Vaccine>('/vaccine', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update(id: string, payload: Partial<CreateVaccinePayload>): Promise<Vaccine> {
    return authRequest<Vaccine>(`/vaccine/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  delete(id: string): Promise<null> {
    return authRequest<null>(`/vaccine/${id}`, { method: 'DELETE' });
  },
};