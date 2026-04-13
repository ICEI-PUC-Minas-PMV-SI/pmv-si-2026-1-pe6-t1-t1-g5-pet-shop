import { EmployeeRepository } from "./repositories/employee.repository";
import { Employee } from "./domain/models/employee";

export class EmployeeService {
  constructor(private readonly repository: EmployeeRepository) {}

  async listAllEmployees(): Promise<Employee[]> {
    return this.repository.list();
  }

  async getEmployeeById(id: string): Promise<Employee> {
    if (!id) throw new Error("ID é obrigatório");
    return this.repository.getById(id);
  }

  async createEmployee(data: Employee): Promise<Employee> {
    return this.repository.create(data);
  }

  async updateEmployee(id: string, data: Partial<Employee>): Promise<Employee> {
    if (!id) throw new Error("ID é obrigatório");
    return this.repository.update(id, data);
  }

  async deleteEmployee(id: string): Promise<void> {
    if (!id) throw new Error("ID é obrigatório");
    return this.repository.delete(id);
  }
}

