import { TutorRepository } from "./tutor.repository";
import { TutorDatasource } from "../datasources/tutor.datasource";
import { TutorMapper } from "../domain/mappers/tutor.mapper";
import { Tutor } from "../domain/models/tutor";

export class TutorRepositoryImpl implements TutorRepository {
  constructor(
    private readonly datasource: TutorDatasource,
    private readonly mapper: TutorMapper
  ) {}

  async create(data: Partial<Tutor>): Promise<Tutor> {
    const entity = this.mapper.toEntity(data as Tutor);
    const { data: result, error } = await this.datasource.create(entity);

    if (error) throw new Error(error.message);
    return this.mapper.toObject(result!);
  }

  async delete(id: string): Promise<Tutor> {
    const { data: existingTutor } = await this.datasource.findById(id);

    await this.datasource.delete(id);

    return this.mapper.toObject(existingTutor);
  }

  async getAll(): Promise<Tutor[]> {
    const { data } = await this.datasource.getAll();
    return data ? data.map((item: any) => this.mapper.toObject(item)) : [];
  }

  // ✅ NOVO
  async update(id: string, data: Partial<Tutor>): Promise<Tutor> {
    const entity = this.mapper.toEntity(data as Tutor);
    const { data: result, error } = await this.datasource.update(id, entity);

    if (error) throw new Error(error.message);
    return this.mapper.toObject(result!);
  }
}