import { PetEntity } from "./entities/pet.entity";
import { DbResult } from "../../../shared/utils/supabase.extensions";

export interface PetDatasource {
  getAll(): Promise<DbResult<PetEntity[]>>;
  getById(id: string): Promise<DbResult<PetEntity>>;
  create(pet: Partial<PetEntity>): Promise<DbResult<PetEntity>>;
  update(id: string, pet: Partial<PetEntity>): Promise<DbResult<PetEntity>>;
  delete(id: string): Promise<DbResult<null>>;
}

