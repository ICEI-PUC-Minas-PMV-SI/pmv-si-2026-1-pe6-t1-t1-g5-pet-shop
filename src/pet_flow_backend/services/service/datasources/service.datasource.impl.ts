import { ServiceDatasource } from "./service.datasource";
import { ServiceEntity } from "./entities/service.entity";
import { supabaseExtensions, DbResult } from "../../../shared/utils/supabase.extensions";

export class ServiceDatasourceImpl implements ServiceDatasource {
  private readonly table = "service";

  async findAll(): Promise<DbResult<ServiceEntity[]>> {
    return supabaseExtensions.getAll<ServiceEntity>(this.table);
  }

  async findById(id: string): Promise<DbResult<ServiceEntity>> {
    return supabaseExtensions.getById<ServiceEntity>(this.table, id);
  }

  async create(data: Partial<ServiceEntity>): Promise<DbResult<ServiceEntity>> {
    return supabaseExtensions.create<ServiceEntity>(this.table, data);
  }

  async update(id: string, data: Partial<ServiceEntity>): Promise<DbResult<ServiceEntity>> {
  return supabaseExtensions.update<ServiceEntity>(this.table, id, {
    ...data,
    updated_at: new Date()
  });
}

  async delete(id: string): Promise<DbResult<null>> {
    return supabaseExtensions.delete(this.table, id);
  }
}