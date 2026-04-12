import { VaccineRepository } from "./vaccine.repository";
import { VaccineDatasource } from "../datasources/vaccine.datasource";
import { VaccineMapper } from "../domain/mappers/vaccine.mapper";
import { Vaccine } from "../domain/models/vaccine";

export class VaccineRepositoryImpl implements VaccineRepository {
  constructor(
    private readonly datasource: VaccineDatasource,
    private readonly mapper: VaccineMapper
  ) {}

  async create(data: Partial<Vaccine>): Promise<Vaccine> {
    const entity = this.mapper.toEntity(data as Vaccine);
    const { data: result, error } = await this.datasource.create(entity);

    if (error) throw new Error(error.message);
    return this.mapper.toObject(result!);
  }

  async update(id: string, data: Partial<Vaccine>): Promise<Vaccine> {
    const entity = this.mapper.toEntity(data as Vaccine);
    const { data: result, error } = await this.datasource.update(id, entity);

    if (error) throw new Error(error.message);
    return this.mapper.toObject(result!);
  }

  async delete(id: string): Promise<Vaccine> {
    const { data: existing, error } = await this.datasource.getById(id);

    if (error) throw new Error(error.message);
    if (!existing) throw new Error("Vacina não encontrada");

    await this.datasource.delete(id);

    return this.mapper.toObject(existing);
  }

  async getAll(): Promise<Vaccine[]> {
    const { data } = await this.datasource.getAll();
    return data ? this.mapper.toObjects(data) : [];
  }
}