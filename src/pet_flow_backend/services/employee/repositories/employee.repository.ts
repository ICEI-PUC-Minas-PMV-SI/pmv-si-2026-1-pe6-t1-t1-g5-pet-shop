import { Employee } from "../domain/models/employee";

export interface EmployeeRepository {
  list(): Promise<Employee[]>;
  getById(id: string): Promise<Employee>;
  create(employee: Employee): Promise<Employee>;
  update(id: string, employee: Partial<Employee>): Promise<Employee>;
  delete(id: string): Promise<void>;
}

