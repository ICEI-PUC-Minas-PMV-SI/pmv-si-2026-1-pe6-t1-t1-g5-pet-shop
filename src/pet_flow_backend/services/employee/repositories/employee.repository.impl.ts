import { EmployeeDatasource } from "../datasources/employee.datasource";
import { EmployeeMapper } from "../domain/mappers/employee.mapper";
import { Employee } from "../domain/models/employee";
import { EmployeeRepository } from "./employee.repository";

export class EmployeeRepositoryImpl implements EmployeeRepository {
  constructor(
    private readonly datasource: EmployeeDatasource,
    private readonly mapper: EmployeeMapper,
  ) {}

  async getAll(): Promise<Employee[]> {
    try {
      const { data, error } = await this.datasource.getAll();

      if (error) {
        return [];
      }

      return this.mapper.toObjects(data || []);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getById(id: string): Promise<Employee> {
    try {
      const { data, error } = await this.datasource.getById(id);

      if (error) {
        throw new Error(error.message);
      }

      return this.mapper.toObject(data!);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getByClinic(clinicId: string): Promise<Employee[]> {
    try {
      const { data, error } = await this.datasource.getAll();

      if (error) {
        return [];
      }

      const filtered = (data || []).filter(
        (employee) => employee.clinic_id === clinicId,
      );

      return this.mapper.toObjects(filtered);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async create(employee: Partial<Employee>): Promise<Employee> {
    try {
      const entity = this.mapper.toReversedObject(employee as Employee);

      // Remove id, created_at e updated_at para o banco gerar automaticamente
      const { id, created_at, updated_at, ...entityWithoutId } = entity as any;

      const { data, error } = await this.datasource.create(entityWithoutId);

      if (error) {
        throw new Error(error.message);
      }

      return this.mapper.toObject(data!);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(id: string, employee: Partial<Employee>): Promise<Employee> {
    try {
      const entity = this.mapper.toReversedObject(employee as Employee);

      // Remove id, created_at e updated_at para não sobrescrever no update
      const { id: _, created_at, updated_at, ...entityWithoutId } = entity as any;

      const { data, error } = await this.datasource.update(id, entityWithoutId);

      if (error) {
        throw new Error(error.message);
      }

      return this.mapper.toObject(data!);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.datasource.delete(id);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getByEmail(email: string): Promise<Employee> {
    try {
      const { data, error } = await this.datasource.getByEmail(email);

      if (error) throw new Error(error.message);
      if (!data) throw new Error('Employee not found');

      return this.mapper.toObject(data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}