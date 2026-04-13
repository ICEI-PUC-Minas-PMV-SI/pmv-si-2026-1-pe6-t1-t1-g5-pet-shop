import { PetDatasource } from "./pet.datasource";
import { PetEntity } from "./entities/pet.entity";
import { supabaseExtensions, DbResult } from "../../../shared/utils/supabase.extensions";

export class PetDatasourceImpl implements PetDatasource {
  private readonly table = "pets";

  async getAll(): Promise<DbResult<PetEntity[]>> {
    return supabaseExtensions.getAll<PetEntity>(this.table);
  }

  async getById(id: string): Promise<DbResult<PetEntity>> {
    return supabaseExtensions.getById<PetEntity>(this.table, id);
  }

  async create(pet: Partial<PetEntity>): Promise<DbResult<PetEntity>> {
    return supabaseExtensions.create<PetEntity>(this.table, pet);
  }

  async update(id: string, pet: Partial<PetEntity>): Promise<DbResult<PetEntity>> {
    return supabaseExtensions.update<PetEntity>(this.table, id, pet);
  }

  async delete(id: string): Promise<DbResult<null>> {
    return supabaseExtensions.delete(this.table, id);
  }
}

