import { PetDatasource } from "../datasources/pet.datasource";
import { PetMapper } from "../domain/mappers/pet.mapper";
import { Pet } from "../domain/models/pet";
import { PetRepository } from "./pet.repository";

export class PetRepositoryImpl implements PetRepository {
  constructor(
    private readonly datasource: PetDatasource,
    private readonly mapper: PetMapper
  ) {}

  async getAll(): Promise<Pet[]> {
    try {
      const { data, error } = await this.datasource.getAll();
      if (error) return [];
      return this.mapper.toObjects(data || []);
    } catch (error) {
      return [];
    }
  }

  async getById(id: string): Promise<Pet> {
    try {
      const { data, error } = await this.datasource.getById(id);
      if (error) throw new Error(error.message);
      return this.mapper.toObject(data!);
    } catch (error) {
      throw error;
    }
  }

  async create(pet: Partial<Pet>): Promise<Pet> {
    try {
      const entity = this.mapper.toReversedObject(pet as Pet);
      const { data, error } = await this.datasource.create(entity);
      if (error) throw new Error(error.message);
      return this.mapper.toObject(data!);
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, pet: Partial<Pet>): Promise<Pet> {
    try {
      const entity = this.mapper.toReversedObject(pet as Pet);
      const { data, error } = await this.datasource.update(id, entity);
      if (error) throw new Error(error.message);
      return this.mapper.toObject(data!);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.datasource.delete(id);
      if (error) throw new Error(error.message);
    } catch (error) {
      throw error;
    }
  }
}

