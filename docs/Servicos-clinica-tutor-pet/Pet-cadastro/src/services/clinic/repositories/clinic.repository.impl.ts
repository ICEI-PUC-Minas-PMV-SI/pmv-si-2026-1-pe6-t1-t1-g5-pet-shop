import { Clinic } from "../domain/models/clinic";
import { ClinicMapper } from "../domain/mappers/clinic.mapper";
import { ClinicDatasource } from "../datasources/clinic.datasource";
import { ClinicRepository } from "./clinic.repository";

export class ClinicRepositoryImpl extends ClinicRepository {
  constructor(
    private readonly datasource: ClinicDatasource,
    private readonly mapper: ClinicMapper
  ) {
    super();
  }

  async create(clinic: Clinic): Promise<Clinic> {
    const entity = this.mapper.toEntity(clinic);

    const { data, error } = await this.datasource.insert(entity);

    if (error) throw new Error(error.message);
    return this.mapper.toObject(data!);
  }

  async getClinics(): Promise<Clinic[]> {
    const { data } = await this.datasource.getAll();
    return this.mapper.toObjects(data || []);
  }

  async updateClinic(id: string, clinic: Partial<Clinic>): Promise<Clinic> {
    const entity = this.mapper.toEntity(clinic as Clinic);
    const { data, error } = await this.datasource.update(id, entity);

    if (error) throw new Error(error.message);
    return this.mapper.toObject(data!);
  }

  // ✅ FALTAVA ESSE MÉTODO
  async delete(id: string): Promise<void> {
    const { error } = await this.datasource.delete(id);

    if (error) throw new Error(error.message);
  }
}