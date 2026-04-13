import { ClinicEntity } from "./entities/clinic.entity";
import { DbResult } from "../../../shared/utils/supabase.extensions";

export interface ClinicDatasource {
  getAll(): Promise<DbResult<ClinicEntity[]>>;
  getById(id: string): Promise<DbResult<ClinicEntity>>;
  create(clinic: Partial<ClinicEntity>): Promise<DbResult<ClinicEntity>>;
  update(
    id: string,
    clinic: Partial<ClinicEntity>,
  ): Promise<DbResult<ClinicEntity>>;
  delete(id: string): Promise<DbResult<null>>;
}
