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
  petName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTutorPayload {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  address: string;
  clinic_id: string;
}

interface RawTutorPayload {
  id?: string | number;
  tutorId?: string | number;
  tutor_id?: string | number;
  idTutor?: string | number;
  id_tutor?: string | number;
  userId?: string | number;
  user_id?: string | number;
  uuid?: string | number;
  name?: string;
  tutorName?: string;
  tutor_name?: string;
  cpf?: string;
  address?: string;
  phone?: string;
  email?: string;
  petName?: string;
  pet_name?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

function toStringId(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  return '';
}

function toDate(value: unknown): Date {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return new Date();
}

function extractTutorList(payload: unknown): RawTutorPayload[] {
  if (Array.isArray(payload)) {
    return payload as RawTutorPayload[];
  }

  if (payload && typeof payload === 'object') {
    const source = payload as Record<string, unknown>;
    const nested = source.data ?? source.items ?? source.tutors ?? source.results;
    if (Array.isArray(nested)) {
      return nested as RawTutorPayload[];
    }
  }

  return [];
}

function normalizeTutor(raw: RawTutorPayload): Tutor {
  return {
    id:
      toStringId(raw.id) ||
      toStringId(raw.tutorId) ||
      toStringId(raw.tutor_id) ||
      toStringId(raw.idTutor) ||
      toStringId(raw.id_tutor) ||
      toStringId(raw.userId) ||
      toStringId(raw.user_id) ||
      toStringId(raw.uuid),
    name: raw.name || raw.tutorName || raw.tutor_name || '',
    cpf: raw.cpf || '',
    address: raw.address || '',
    phone: raw.phone || '',
    email: raw.email || '',
    petName: raw.petName || raw.pet_name,
    createdAt: toDate(raw.createdAt),
    updatedAt: toDate(raw.updatedAt),
  };
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
  async getAll(): Promise<Tutor[]> {
    const response = await authRequest<unknown>('/tutor', { method: 'GET' });

    return extractTutorList(response)
      .map(normalizeTutor)
      .filter((item) => item.id !== '');
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