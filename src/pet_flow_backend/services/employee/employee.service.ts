import { EmployeeRepository } from "./repositories/employee.repository";

import { Employee } from "./domain/models/employee";

export class EmployeeService {
  constructor(
    private readonly repository: EmployeeRepository,
  ) {}

  async listAllEmployees(): Promise<Employee[]> {
    return this.repository.getAll();
  }

  async getEmployeeById(
    id: string,
  ): Promise<Employee> {
    if (!id) {
      throw new Error("ID é obrigatório");
    }

    return this.repository.getById(id);
  }

  async getEmployeesByClinic(
    clinicId: string,
  ): Promise<Employee[]> {
    if (!clinicId) {
      throw new Error(
        "Clinic ID é obrigatório",
      );
    }

    return this.repository.getByClinic(
      clinicId,
    );
  }

  async createEmployee(
    employee: Partial<Employee>,
  ): Promise<Employee> {
    return this.repository.create(employee);
  }

  async updateEmployee(
    id: string,
    employee: Partial<Employee>,
  ): Promise<Employee> {
    if (!id) {
      throw new Error("ID é obrigatório");
    }

    return this.repository.update(
      id,
      employee,
    );
  }

  async deleteEmployee(
    id: string,
  ): Promise<void> {
    if (!id) {
      throw new Error("ID é obrigatório");
    }

    return this.repository.delete(id);
  }
}