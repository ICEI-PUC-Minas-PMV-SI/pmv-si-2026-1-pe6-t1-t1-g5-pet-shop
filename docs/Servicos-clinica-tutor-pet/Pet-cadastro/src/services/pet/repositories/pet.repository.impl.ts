import { PetRepository } from "./pet.repository";
import { PetDatasource } from "../datasources/pet.datasource";
import { PetMapper } from "../domain/mappers/pet.mapper";
import { Pet } from "../domain/models/pet";

export class PetRepositoryImpl implements PetRepository {
  constructor(
    private readonly datasource: PetDatasource,
    private readonly mapper: PetMapper
  ) {}

  async create(data: Partial<Pet>): Promise<Pet> {
    const entity = this.mapper.toEntity(data as Pet);
    const { data: result, error } = await this.datasource.create(entity);

    if (error) throw new Error(error.message);
    if (!result) throw new Error("Erro ao criar");

    return this.mapper.toObject(result);
  }

  async delete(id: string): Promise<Pet> {
    const { data: existingPet, error } = await this.datasource.findById(id);

    if (error) throw new Error(error.message);
    if (!existingPet) throw new Error("Pet não encontrado");

    await this.datasource.delete(id);

    return this.mapper.toObject(existingPet);
  }

  // ✅ NOVO
  async update(id: string, data: Partial<Pet>): Promise<Pet> {
    const entity = this.mapper.toEntity(data as Pet);
    const { data: result, error } = await this.datasource.update(id, entity);

    if (error) throw new Error(error.message);
    if (!result) throw new Error("Erro ao atualizar");

    return this.mapper.toObject(result);
  }

  async getAll(): Promise<Pet[]> {
    const { data } = await this.datasource.getAll();
    return data ? data.map((item: any) => this.mapper.toObject(item)) : [];
  }
}