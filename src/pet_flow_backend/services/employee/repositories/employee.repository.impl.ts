import { EmployeeDatasource } from "../datasources/employee.datasource";
import { EmployeeMapper } from "../domain/mappers/employee.mapper";
import { Employee } from "../domain/models/employee";
import { EmployeeRepository } from "./employee.repository";

export class EmployeeRepositoryImpl implements EmployeeRepository {
  constructor(
    private readonly datasource: EmployeeDatasource,
    private readonly mapper: EmployeeMapper,
  ) {}

  async list(): Promise<Employee[]> {
    try {
      const { data, error } = await this.datasource.getAll();
      if (error) return [];
      return this.mapper.toObjects(data || []);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getById(id: string): Promise<Employee> {
    try {
      const { data, error } = await this.datasource.getById(id);
      if (error) throw new Error(error.message);
      return this.mapper.toObject(data!);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async create(employee: Employee): Promise<Employee> {
    try {
      const entity = this.mapper.toReversedObject(employee);
      const { data, error } = await this.datasource.create(entity);
      if (error) throw new Error(error.message);
      return this.mapper.toObject(data!);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(id: string, employee: Partial<Employee>): Promise<Employee> {
    try {
      const entity = this.mapper.toReversedObject(employee as Employee);
      const { data, error } = await this.datasource.update(id, entity);
      if (error) throw new Error(error.message);
      return this.mapper.toObject(data!);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.datasource.delete(id);
      if (error) throw new Error(error.message);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
