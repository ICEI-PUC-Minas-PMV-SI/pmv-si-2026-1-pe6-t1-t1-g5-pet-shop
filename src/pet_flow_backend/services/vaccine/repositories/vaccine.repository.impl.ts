import { VaccineDatasource } from "../datasources/vaccine.datasource";
import { VaccineMapper } from "../domain/mappers/vaccine.mapper";
import { Vaccine } from "../domain/models/vaccine";
import { VaccineRepository } from "./vaccine.repository";

export class VaccineRepositoryImpl implements VaccineRepository {
  constructor(
    private readonly datasource: VaccineDatasource,
    private readonly mapper: VaccineMapper,
  ) {}

  async list(): Promise<Vaccine[]> {
    try {
      const { data, error } = await this.datasource.getAll();
      if (error) return [];
      return this.mapper.toObjects(data || []);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getById(id: string): Promise<Vaccine> {
    try {
      const { data, error } = await this.datasource.getById(id);
      if (error) throw new Error(error.message);
      return this.mapper.toObject(data!);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async create(vaccine: Partial<Vaccine>): Promise<Vaccine> {
    try {
      const entity = this.mapper.toReversedObject(vaccine as Vaccine);
      const { data, error } = await this.datasource.create(entity);
      if (error) throw new Error(error.message);
      return this.mapper.toObject(data!);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(id: string, vaccine: Partial<Vaccine>): Promise<Vaccine> {
    try {
      const entity = this.mapper.toReversedObject(vaccine as Vaccine);
      const { data, error } = await this.datasource.update(id, entity);
      if (error) throw new Error(error.message);
      return this.mapper.toObject(data!);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.datasource.delete(id);
      if (error) throw new Error(error.message);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
