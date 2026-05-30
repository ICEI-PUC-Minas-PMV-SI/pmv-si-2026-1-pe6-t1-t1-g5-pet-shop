import { authRequest } from './auth';

export interface Service extends Record<string, unknown> {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  created_at: string;
  updated_at?: string;
}

export interface CreateServicePayload {
  name: string;
  description: string;
  price: number;
  duration: number;
}

export const serviceService = {
  list(): Promise<Service[]> {
    return authRequest<Service[]>('/service', {
      method: 'GET',
    });
  },

  create(payload: CreateServicePayload): Promise<Service> {
    return authRequest<Service>('/service', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update(
    id: string,
    payload: Partial<CreateServicePayload>
  ): Promise<Service> {
    return authRequest<Service>(`/service/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  delete(id: string): Promise<null> {
    return authRequest<null>(`/service/${id}`, {
      method: 'DELETE',
    });
  },
};