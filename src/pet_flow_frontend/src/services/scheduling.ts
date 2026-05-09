import { authRequest } from './auth';

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
  list: (): Promise<Scheduling[]> => authRequest<Scheduling[]>('/scheduling', { method: 'GET' }),
  create: (payload: SaveSchedulingPayload): Promise<Scheduling> =>
    authRequest<Scheduling>('/scheduling', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: SaveSchedulingPayload): Promise<Scheduling> =>
    authRequest<Scheduling>(`/scheduling/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  remove: (id: string): Promise<void> =>
    authRequest<void>(`/scheduling/${id}`, {
      method: 'DELETE',
    }),
  listTutors: (): Promise<Tutor[]> => authRequest<Tutor[]>('/tutor', { method: 'GET' }),
  listPets: (): Promise<Pet[]> => authRequest<Pet[]>('/pet', { method: 'GET' }),
  listEmployees: (): Promise<Employee[]> => authRequest<Employee[]>('/employee', { method: 'GET' }),
  getEmployeeById: (id: string): Promise<Employee> => authRequest<Employee>(`/employee/${id}`, { method: 'GET' }),
  listPetServices: (): Promise<PetService[]> => authRequest<PetService[]>('/service', { method: 'GET' }),
  listClinics: (): Promise<Clinic[]> => authRequest<Clinic[]>('/clinic', { method: 'GET' }),
};
