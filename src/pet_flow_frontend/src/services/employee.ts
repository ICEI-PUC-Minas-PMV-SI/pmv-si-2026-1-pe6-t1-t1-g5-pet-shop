import { authStorage } from './auth';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://pmv-si-2026-1-pe6-t1-t1-g5-pet-shop.onrender.com/api/v1';

export interface Employee {
  id: string;
  name: string;
  cpf: string;
  address: string;
  phone: string;
  email: string;
  role: string;
  clinicId: string;
}

interface ApiError {
  error: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = authStorage.getToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error((data as ApiError).error || 'Erro inesperado');
  }

  return data as T;
}

export const employeeService = {
  async getAll(): Promise<Employee[]> {
    return request<Employee[]>('/employee');
  },

  async create(employee: Partial<Employee>): Promise<Employee> {
    return request<Employee>('/employee', {
      method: 'POST',
      body: JSON.stringify(employee),
    });
  },

  async update(id: string, employee: Partial<Employee>): Promise<Employee> {
    return request<Employee>(`/employee/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employee),
    });
  },

  async delete(id: string): Promise<void> {
    return request<void>(`/employee/${id}`, {
      method: 'DELETE',
    });
  },
};