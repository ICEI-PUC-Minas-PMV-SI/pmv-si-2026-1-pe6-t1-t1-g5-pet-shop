import { authRequest } from './auth';

export interface EmployeeData {
  id: string;
  name: string;
  cpf: string;
  address: string;
  phone: string;
  email: string;
  role: string;
  clinicId: string;
  createdAt: string;
  updatedAt: string;
}

export type Employee = EmployeeData;

export const employeeService = {
  getAll(): Promise<EmployeeData[]> {
    return authRequest<EmployeeData[]>('/employee', {
      method: 'GET',
    });
  },

  getMe(): Promise<EmployeeData> {
    return authRequest<EmployeeData>('/employee/me', {
      method: 'GET',
    });
  },

  getById(id: string): Promise<EmployeeData> {
    return authRequest<EmployeeData>(`/employee/${id}`, {
      method: 'GET',
    });
  },

  create(payload: Omit<EmployeeData, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmployeeData> {
    return authRequest<EmployeeData>('/employee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },

  update(id: string, payload: Partial<Omit<EmployeeData, 'id' | 'createdAt' | 'updatedAt'>>): Promise<EmployeeData> {
    return authRequest<EmployeeData>(`/employee/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },

  delete(id: string): Promise<void> {
    return authRequest<void>(`/employee/${id}`, {
      method: 'DELETE',
    });
  },
};