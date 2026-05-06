import { authStorage } from './auth';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://pmv-si-2026-1-pe6-t1-t1-g5-pet-shop.onrender.com/api/v1';

interface ApiError {
  error?: string;
  message?: string;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = (await response.json()) as unknown;

  if (!response.ok) {
    const apiError = data as ApiError;
    throw new Error(apiError.error || apiError.message || 'Erro inesperado');
  }

  return data as T;
}

export interface Scheduling {
  id: string;
  clinicId: string;
  tutorId: string;
  petId: string;
  employeeId: string;
  dateTime: string;
  status: string;
  totalValue: number;
  notes: string;
  createdAt: string;
}

export interface Tutor {
  id: string;
  name: string;
}

export interface Pet {
  id: string;
  name: string;
  tutorId: string;
}

export interface Employee {
  id: string;
  name: string;
}

export interface PetService {
  id: string;
  name: string;
  price: number;
}

export interface Clinic {
  id: string;
  name: string;
}

export interface SaveSchedulingPayload {
  clinicId: string;
  tutorId: string;
  petId: string;
  employeeId: string;
  dateTime: string;
  status: string;
  totalValue: number;
  notes?: string;
}

export const schedulingService = {
  list: (): Promise<Scheduling[]> => request<Scheduling[]>('/scheduling'),
  create: (payload: SaveSchedulingPayload): Promise<Scheduling> =>
    request<Scheduling>('/scheduling', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: SaveSchedulingPayload): Promise<Scheduling> =>
    request<Scheduling>(`/scheduling/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  remove: (id: string): Promise<void> =>
    request<void>(`/scheduling/${id}`, {
      method: 'DELETE',
    }),
  listTutors: (): Promise<Tutor[]> => request<Tutor[]>('/tutor'),
  listPets: (): Promise<Pet[]> => request<Pet[]>('/pet'),
  listEmployees: (): Promise<Employee[]> => request<Employee[]>('/employee'),
  getEmployeeById: (id: string): Promise<Employee> => request<Employee>(`/employee/${id}`),
  listPetServices: (): Promise<PetService[]> => request<PetService[]>('/service'),
  listClinics: (): Promise<Clinic[]> => request<Clinic[]>('/clinic'),
};
