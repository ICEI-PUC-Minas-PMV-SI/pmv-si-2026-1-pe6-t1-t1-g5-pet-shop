import { PetDatasource } from "./pet.datasource";
import { PetEntity } from "./entities/pet.entity";
import {
  supabaseExtensions,
  DbResult,
} from "../../../shared/utils/supabase.extensions";

export class PetDatasourceImpl implements PetDatasource {
  private readonly table = "pet";

  private normalizePayload(pet: Partial<PetEntity>): Partial<PetEntity> {
    const payload = { ...pet } as Record<string, unknown>;

    const tutorId = payload.tutorId;
    const tutor_id = payload.tutor_id;

    if ((tutor_id === undefined || tutor_id === null || tutor_id === "") && tutorId !== undefined) {
      payload.tutor_id = tutorId;
    }

    delete payload.tutorId;

    return payload as Partial<PetEntity>;
  }

  async getAll(): Promise<DbResult<PetEntity[]>> {
    return supabaseExtensions.getAll<PetEntity>(this.table);
  }

  async getById(id: string): Promise<DbResult<PetEntity>> {
    return supabaseExtensions.getById<PetEntity>(this.table, id);
  }

  async create(pet: Partial<PetEntity>): Promise<DbResult<PetEntity>> {
    return supabaseExtensions.create<PetEntity>(this.table, this.normalizePayload(pet));
  }

  async update(
    id: string,
    pet: Partial<PetEntity>,
  ): Promise<DbResult<PetEntity>> {
    return supabaseExtensions.update<PetEntity>(this.table, id, this.normalizePayload(pet));
  }

  async delete(id: string): Promise<DbResult<null>> {
    return supabaseExtensions.delete(this.table, id);
  }
}
