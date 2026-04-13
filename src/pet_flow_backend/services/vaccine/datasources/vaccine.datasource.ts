import { VaccineEntity } from "./entities/vaccine.entity";
import { DbResult } from "../../../shared/utils/supabase.extensions";

export interface VaccineDatasource {
  getAll(): Promise<DbResult<VaccineEntity[]>>;
  getById(id: string): Promise<DbResult<VaccineEntity>>;
  create(vaccine: Partial<VaccineEntity>): Promise<DbResult<VaccineEntity>>;
  update(id: string, vaccine: Partial<VaccineEntity>): Promise<DbResult<VaccineEntity>>;
  delete(id: string): Promise<DbResult<null>>;
}

