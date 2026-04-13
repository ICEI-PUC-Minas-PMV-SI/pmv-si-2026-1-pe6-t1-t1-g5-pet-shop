import { VaccineDatasource } from "./vaccine.datasource";
import { VaccineEntity } from "./entities/vaccine.entity";
import {
  supabaseExtensions,
  DbResult,
} from "../../../shared/utils/supabase.extensions";

export class VaccineDatasourceImpl implements VaccineDatasource {
  private readonly table = "vaccines";

  async getAll(): Promise<DbResult<VaccineEntity[]>> {
    return supabaseExtensions.getAll<VaccineEntity>(this.table);
  }

  async getById(id: string): Promise<DbResult<VaccineEntity>> {
    return supabaseExtensions.getById<VaccineEntity>(this.table, id);
  }

  async create(
    vaccine: Partial<VaccineEntity>,
  ): Promise<DbResult<VaccineEntity>> {
    return supabaseExtensions.create<VaccineEntity>(this.table, vaccine);
  }

  async update(
    id: string,
    vaccine: Partial<VaccineEntity>,
  ): Promise<DbResult<VaccineEntity>> {
    return supabaseExtensions.update<VaccineEntity>(this.table, id, vaccine);
  }

  async delete(id: string): Promise<DbResult<null>> {
    return supabaseExtensions.delete(this.table, id);
  }
}
