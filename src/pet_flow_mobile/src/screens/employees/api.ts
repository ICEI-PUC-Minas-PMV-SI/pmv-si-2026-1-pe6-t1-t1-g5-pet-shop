import { authRequest } from '../../services/http';

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

export const employeeService = {
  getAll(): Promise<Employee[]> {
    return authRequest<Employee[]>('/employee', {
      method: 'GET',
    });
  },

  create(payload: Partial<Employee>): Promise<Employee> {
    return authRequest<Employee>('/employee', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update(id: string, payload: Partial<Employee>): Promise<Employee> {
    return authRequest<Employee>(`/employee/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  delete(id: string): Promise<void> {
    return authRequest<void>(`/employee/${id}`, {
      method: 'DELETE',
    });
  },
};