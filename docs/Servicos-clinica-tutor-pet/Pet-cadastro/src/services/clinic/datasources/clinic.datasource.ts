import { ClinicEntity } from "./entities/clinic.entity";
import { DbResult } from "../../../shared/utils/supabase.extensions";

export interface ClinicDatasource {
  insert(clinic: ClinicEntity): Promise<DbResult<ClinicEntity>>;
  getAll(): Promise<DbResult<ClinicEntity[]>>;
  update(id: string, clinic: Partial<ClinicEntity>): Promise<DbResult<ClinicEntity>>;

  // ✅ FALTAVA ESSE
  delete(id: string): Promise<DbResult<null>>;
}