import { EmployeeDatasource } from "./employee.datasource";
import { EmployeeEntity } from "./entities/employee.entity";
import { supabaseExtensions, DbResult } from "../../../shared/utils/supabase.extensions";

export class EmployeeDatasourceImpl implements EmployeeDatasource {
  private readonly table = "employees";

  async getAll(): Promise<DbResult<EmployeeEntity[]>> {
    return supabaseExtensions.getAll<EmployeeEntity>(this.table);
  }

  async getById(id: string): Promise<DbResult<EmployeeEntity>> {
    return supabaseExtensions.getById<EmployeeEntity>(this.table, id);
  }

  async create(employee: EmployeeEntity): Promise<DbResult<EmployeeEntity>> {
    return supabaseExtensions.create<EmployeeEntity>(this.table, employee);
  }

  async update(id: string, employee: Partial<EmployeeEntity>): Promise<DbResult<EmployeeEntity>> {
    return supabaseExtensions.update<EmployeeEntity>(this.table, id, employee);
  }

  async delete(id: string): Promise<DbResult<null>> {
    return supabaseExtensions.delete(this.table, id);
  }
}

