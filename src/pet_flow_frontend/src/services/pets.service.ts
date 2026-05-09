import { authStorage } from './auth';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://pmv-si-2026-1-pe6-t1-t1-g5-pet-shop.onrender.com/api/v1';

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  tutorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePetPayload {
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  tutorId: string;
}

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

  if (response.status === 204) return {} as T;

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Erro inesperado no servidor');
  }

  return data as T;
}

export const petsService = {
  getAll(): Promise<Pet[]> {
    return authRequest<Pet[]>('/pet', { method: 'GET' });
  },

  getById(id: string): Promise<Pet> {
    return authRequest<Pet>(`/pet/${id}`, { method: 'GET' });
  },

  create(payload: CreatePetPayload): Promise<Pet> {
    return authRequest<Pet>('/pet', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update(id: string, payload: Partial<CreatePetPayload>): Promise<Pet> {
    return authRequest<Pet>(`/pet/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  delete(id: string): Promise<null> {
    return authRequest<null>(`/pet/${id}`, { method: 'DELETE' });
  },
};