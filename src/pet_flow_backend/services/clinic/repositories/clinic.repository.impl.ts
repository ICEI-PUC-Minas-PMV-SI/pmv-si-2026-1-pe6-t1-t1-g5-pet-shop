import { ClinicDatasource } from "../datasources/clinic.datasource";
import { ClinicMapper } from "../domain/mappers/clinic.mapper";
import { Clinic } from "../domain/models/clinic";
import { ClinicRepository } from "./clinic.repository";

export class ClinicRepositoryImpl implements ClinicRepository {
  constructor(
    private readonly datasource: ClinicDatasource,
    private readonly mapper: ClinicMapper
  ) {}

  async getClinics(): Promise<Clinic[]> {
    try {
      const { data, error } = await this.datasource.getAll();
      if (error) return [];
      return this.mapper.toObjects(data || []);
    } catch (error) {
      return [];
    }
  }

  async getById(id: string): Promise<Clinic> {
    try {
      const { data, error } = await this.datasource.getById(id);
      if (error) throw new Error(error.message);
      return this.mapper.toObject(data!);
    } catch (error) {
      throw error;
    }
  }

  async createClinic(clinic: Partial<Clinic>): Promise<Clinic> {
    try {
      const entity = this.mapper.toReversedObject(clinic as Clinic);
      const { data, error } = await this.datasource.create(entity);
      if (error) throw new Error(error.message);
      return this.mapper.toObject(data!);
    } catch (error) {
      throw error;
    }
  }

  async updateClinic(id: string, clinic: Partial<Clinic>): Promise<Clinic> {
    try {
      const entity = this.mapper.toReversedObject(clinic as Clinic);
      const { data, error } = await this.datasource.update(id, entity);
      if (error) throw new Error(error.message);
      return this.mapper.toObject(data!);
    } catch (error) {
      throw error;
    }
  }

  async deleteClinic(id: string): Promise<void> {
    try {
      const { error } = await this.datasource.delete(id);
      if (error) throw new Error(error.message);
    } catch (error) {
      throw error;
    }
  }
}

