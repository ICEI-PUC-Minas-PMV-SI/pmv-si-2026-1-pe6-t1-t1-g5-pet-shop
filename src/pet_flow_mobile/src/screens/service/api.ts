import { authRequest } from '../../services/http';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  clinicId: string;
}

export const serviceService = {
  getAll(): Promise<Service[]> {
    return authRequest<Service[]>('/service', {
      method: 'GET',
    });
  },

  create(payload: Partial<Service>): Promise<Service> {
    return authRequest<Service>('/service', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update(id: string, payload: Partial<Service>): Promise<Service> {
    return authRequest<Service>(`/service/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  delete(id: string): Promise<void> {
    return authRequest<void>(`/service/${id}`, {
      method: 'DELETE',
    });
  },
};
