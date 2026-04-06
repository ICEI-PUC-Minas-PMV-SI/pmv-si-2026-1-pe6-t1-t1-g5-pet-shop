import { DbResult } from "../../../shared/utils/supabase.extensions";
import { SchedulingEntity } from "./entities/scheduling.entity";

export interface SchedulingDatasource {
  getAll(): Promise<DbResult<SchedulingEntity[]>>;
  getById(id: string): Promise<DbResult<SchedulingEntity>>;
  create(
    scheduling: Partial<SchedulingEntity>,
  ): Promise<DbResult<SchedulingEntity>>;
  update(
    id: string,
    scheduling: Partial<SchedulingEntity>,
  ): Promise<DbResult<SchedulingEntity>>;
  delete(id: string): Promise<DbResult<null>>;
}
