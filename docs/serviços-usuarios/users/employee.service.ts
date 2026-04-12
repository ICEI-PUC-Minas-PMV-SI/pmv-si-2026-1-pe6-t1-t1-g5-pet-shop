import { EmployeeRepositoryImpl } from './repositories/employee.repository.impl';
import { validateEmployee } from '../../shared/utils/validators';
import { Employee } from './domain/models/employee';

export class EmployeeService {
  private repository = new EmployeeRepositoryImpl();

  async list(): Promise<Employee[]> {
    return this.repository.list();
  }

  async getById(id: string): Promise<Employee> {
    if (!id) throw new Error("ID é obrigatório");
    return this.repository.getById(id);
  }

  async create(data: Employee): Promise<Employee> {
    validateEmployee(data);
    return this.repository.create(data);
  }

  async delete(id: string): Promise<void> {
    if (!id) throw new Error("ID é obrigatório");
    return this.repository.delete(id);
  }
}