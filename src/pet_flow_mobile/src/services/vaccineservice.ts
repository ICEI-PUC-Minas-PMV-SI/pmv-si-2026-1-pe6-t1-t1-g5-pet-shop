import { authRequest } from './http';

export interface Vaccine {
  id: string;
  name: string;
  date: string;
  status?: string;
  petId: string;
}

export interface CreateVaccinePayload {
  name: string;
  date: string;
  petId: string;
}

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
