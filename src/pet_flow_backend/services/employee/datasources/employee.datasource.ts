import { EmployeeEntity } from "./entities/employee.entity";
import { DbResult } from "../../../shared/utils/supabase.extensions";

export interface EmployeeDatasource {
  getAll(): Promise<DbResult<EmployeeEntity[]>>;
  getById(id: string): Promise<DbResult<EmployeeEntity>>;
  create(employee: EmployeeEntity): Promise<DbResult<EmployeeEntity>>;
  update(
    id: string,
    employee: Partial<EmployeeEntity>,
  ): Promise<DbResult<EmployeeEntity>>;
  delete(id: string): Promise<DbResult<null>>;
}
