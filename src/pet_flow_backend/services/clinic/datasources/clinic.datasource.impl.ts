import { ClinicDatasource } from "./clinic.datasource";
import { ClinicEntity } from "./entities/clinic.entity";
import { supabaseExtensions, DbResult } from "../../../shared/utils/supabase.extensions";

export class ClinicDatasourceImpl implements ClinicDatasource {
  private readonly table = "clinics";

  async getAll(): Promise<DbResult<ClinicEntity[]>> {
    return supabaseExtensions.getAll<ClinicEntity>(this.table);
  }

  async getById(id: string): Promise<DbResult<ClinicEntity>> {
    return supabaseExtensions.getById<ClinicEntity>(this.table, id);
  }

  async create(clinic: Partial<ClinicEntity>): Promise<DbResult<ClinicEntity>> {
    return supabaseExtensions.create<ClinicEntity>(this.table, clinic);
  }

  async update(id: string, clinic: Partial<ClinicEntity>): Promise<DbResult<ClinicEntity>> {
    return supabaseExtensions.update<ClinicEntity>(this.table, id, clinic);
  }

  async delete(id: string): Promise<DbResult<null>> {
    return supabaseExtensions.delete(this.table, id);
  }
}

