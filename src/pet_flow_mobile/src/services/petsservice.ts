import { authRequest } from './http';

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  tutorId: string;
  tutor_name?: string;
  photo_url?: string;
  notes?: string;
  clinic_id?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePetPayload {
  name: string;
  species: string;
  breed?: string;
  tutor_name: string;
  tutor_id?: string;
  age?: number;
  weight?: number;
  notes?: string;
  photo_url?: string;
  clinic_id: string;
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
