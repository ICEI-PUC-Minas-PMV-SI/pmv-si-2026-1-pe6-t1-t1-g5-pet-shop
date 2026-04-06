import { SchedulingDatasource } from "./scheduling.datasource";
import {
  DbResult,
  supabaseExtensions,
} from "../../../shared/utils/supabase.extensions";
import { SchedulingEntity } from "./entities/scheduling.entity";

export class SchedulingDatasourceImpl implements SchedulingDatasource {
  private readonly table = "scheduling";

  constructor() {}

  getAll(): Promise<DbResult<SchedulingEntity[]>> {
    return supabaseExtensions.getAll<SchedulingEntity>(this.table);
  }

  getById(id: string): Promise<DbResult<SchedulingEntity>> {
    return supabaseExtensions.getById<SchedulingEntity>(this.table, id);
  }

  create(
    scheduling: Partial<SchedulingEntity>,
  ): Promise<DbResult<SchedulingEntity>> {
    return supabaseExtensions.create<SchedulingEntity>(this.table, scheduling);
  }

  update(
    id: string,
    scheduling: Partial<SchedulingEntity>,
  ): Promise<DbResult<SchedulingEntity>> {
    return supabaseExtensions.update<SchedulingEntity>(
      this.table,
      id,
      scheduling,
    );
  }

  delete(id: string): Promise<DbResult<null>> {
    return supabaseExtensions.delete(this.table, id);
  }
}
