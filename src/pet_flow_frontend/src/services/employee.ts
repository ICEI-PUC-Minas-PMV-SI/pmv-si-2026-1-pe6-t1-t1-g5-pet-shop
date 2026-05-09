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

  getById(id: string): Promise<EmployeeData> {
    return authRequest<EmployeeData>(`/employee/${id}`, {
      method: 'GET',
    });
  },
};
