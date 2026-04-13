import { TutorDatasource } from "./tutor.datasource";
import { TutorEntity } from "./entities/tutor.entity";
import {
  supabaseExtensions,
  DbResult,
} from "../../../shared/utils/supabase.extensions";

export class TutorDatasourceImpl implements TutorDatasource {
  private readonly table = "tutors";

  async getAll(): Promise<DbResult<TutorEntity[]>> {
    return supabaseExtensions.getAll<TutorEntity>(this.table);
  }

  async getById(id: string): Promise<DbResult<TutorEntity>> {
    return supabaseExtensions.getById<TutorEntity>(this.table, id);
  }

  async create(tutor: Partial<TutorEntity>): Promise<DbResult<TutorEntity>> {
    return supabaseExtensions.create<TutorEntity>(this.table, tutor);
  }

  async update(
    id: string,
    tutor: Partial<TutorEntity>,
  ): Promise<DbResult<TutorEntity>> {
    return supabaseExtensions.update<TutorEntity>(this.table, id, tutor);
  }

  async delete(id: string): Promise<DbResult<null>> {
    return supabaseExtensions.delete(this.table, id);
  }
}
