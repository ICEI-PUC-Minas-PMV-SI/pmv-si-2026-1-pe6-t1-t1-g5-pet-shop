import { TutorEntity } from "./entities/tutor.entity";
import { DbResult } from "../../../shared/utils/supabase.extensions";

export interface TutorDatasource {
  getAll(): Promise<DbResult<TutorEntity[]>>;
  getById(id: string): Promise<DbResult<TutorEntity>>;
  create(tutor: Partial<TutorEntity>): Promise<DbResult<TutorEntity>>;
  update(
    id: string,
    tutor: Partial<TutorEntity>,
  ): Promise<DbResult<TutorEntity>>;
  delete(id: string): Promise<DbResult<null>>;
}
