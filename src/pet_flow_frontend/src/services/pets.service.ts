import { authRequest } from './auth';

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
