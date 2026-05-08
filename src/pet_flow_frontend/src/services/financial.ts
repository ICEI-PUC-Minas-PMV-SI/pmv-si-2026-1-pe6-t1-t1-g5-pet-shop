import { authStorage } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://pmv-si-2026-1-pe6-t1-t1-g5-pet-shop.onrender.com/api/v1';

export interface Transaction {
  idx?: number;
  id: string;
  scheduling_id: string;
  description: string;
  amount: number;
  payment_method: string;
  employee_id: string;
  clinic_id: string;
  created_at: string;
}

export interface CreateTransactionPayload {
  scheduling_id?: string | null;
  description: string;
  amount: number;
  payment_method: string;
  employee_id?: string | null;
  clinic_id: string;
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

export const financialService = {
  getAll(clinicId: string): Promise<Transaction[]> {
    return authRequest<Transaction[]>(`/financial/all?clinic_id=${encodeURIComponent(clinicId)}`, {
      method: 'GET',
    });
  },

  create(payload: CreateTransactionPayload): Promise<Transaction> {
    return authRequest<Transaction>('/financial/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update(payload: Partial<Transaction> & { id: string; clinic_id: string }): Promise<Transaction> {
    return authRequest<Transaction>('/financial/', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  delete(id: string, clinicId: string): Promise<null> {
    return authRequest<null>('/financial/', {
      method: 'DELETE',
      body: JSON.stringify({ id, clinic_id: clinicId }),
    });
  },
};
