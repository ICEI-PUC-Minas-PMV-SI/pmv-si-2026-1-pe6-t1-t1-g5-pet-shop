import { Employee } from "../domain/models/employee";

export interface EmployeeRepository {
  getAll(): Promise<Employee[]>;

  getById(id: string): Promise<Employee>;

  getByClinic(clinicId: string): Promise<Employee[]>;

  create(employee: Partial<Employee>): Promise<Employee>;

  update(id: string, employee: Partial<Employee>): Promise<Employee>;

  delete(id: string): Promise<void>;

  getByEmail(email: string): Promise<Employee>;
}
