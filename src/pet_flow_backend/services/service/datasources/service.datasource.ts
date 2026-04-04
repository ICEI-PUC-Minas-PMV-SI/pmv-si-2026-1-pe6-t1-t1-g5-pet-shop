import { ServiceEntity } from "./entities/service.entity";
import { DbResult } from "../../../shared/utils/supabase.extensions";

export interface ServiceDatasource {
  findAll(): Promise<DbResult<ServiceEntity[]>>;
  findById(id: string): Promise<DbResult<ServiceEntity>>;
  create(data: Partial<ServiceEntity>): Promise<DbResult<ServiceEntity>>;
  update(id: string, data: Partial<ServiceEntity>): Promise<DbResult<ServiceEntity>>;
  delete(id: string): Promise<DbResult<null>>;
}