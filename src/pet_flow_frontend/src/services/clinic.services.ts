import { authStorage } from './auth';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://pmv-si-2026-1-pe6-t1-t1-g5-pet-shop.onrender.com/api/v1';

export interface Clinic {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  active: boolean;
  created_at?: string;
}

export interface CreateClinicPayload {
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
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

  if (response.status === 204) return null as T;

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Erro inesperado');
  }

  return data as T;
}

export const clinicsService = {
  getAll(): Promise<Clinic[]> {
    return authRequest<Clinic[]>('/clinic', {
      method: 'GET',
    });
  },

  getById(id: string): Promise<Clinic> {
    if (!id) throw new Error("ID é obrigatório");
    return authRequest<Clinic>(`/clinic/${id}`, {
      method: 'GET',
    });
  },

  create(payload: CreateClinicPayload): Promise<Clinic> {
    return authRequest<Clinic>('/clinic', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update(id: string, payload: Partial<CreateClinicPayload>): Promise<Clinic> {
    if (!id) throw new Error("ID é obrigatório");
    return authRequest<Clinic>(`/clinic/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  delete(id: string): Promise<null> {
    if (!id) throw new Error("ID é obrigatório");
    return authRequest<null>(`/clinic/${id}`, {
      method: 'DELETE',
    });
  },
};
