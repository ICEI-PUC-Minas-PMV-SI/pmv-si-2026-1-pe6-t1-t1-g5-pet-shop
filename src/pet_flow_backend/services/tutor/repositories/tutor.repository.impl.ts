import { TutorDatasource } from "../datasources/tutor.datasource";
import { TutorMapper } from "../domain/mappers/tutor.mapper";
import { Tutor } from "../domain/models/tutor";
import { TutorRepository } from "./tutor.repository";

export class TutorRepositoryImpl implements TutorRepository {
  constructor(
    private readonly datasource: TutorDatasource,
    private readonly mapper: TutorMapper
  ) {}

  async getAll(): Promise<Tutor[]> {
    try {
      const { data, error } = await this.datasource.getAll();
      if (error) return [];
      return this.mapper.toObjects(data || []);
    } catch (error) {
      return [];
    }
  }

  async getById(id: string): Promise<Tutor> {
    try {
      const { data, error } = await this.datasource.getById(id);
      if (error) throw new Error(error.message);
      return this.mapper.toObject(data!);
    } catch (error) {
      throw error;
    }
  }

  async create(tutor: Partial<Tutor>): Promise<Tutor> {
    try {
      const entity = this.mapper.toReversedObject(tutor as Tutor);
      const { data, error } = await this.datasource.create(entity);
      if (error) throw new Error(error.message);
      return this.mapper.toObject(data!);
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, tutor: Partial<Tutor>): Promise<Tutor> {
    try {
      const entity = this.mapper.toReversedObject(tutor as Tutor);
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

