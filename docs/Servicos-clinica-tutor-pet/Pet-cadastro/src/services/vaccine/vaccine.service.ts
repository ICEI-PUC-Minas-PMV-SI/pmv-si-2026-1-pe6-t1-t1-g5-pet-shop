import { VaccineRepository } from "./repositories/vaccine.repository";
import { Vaccine } from "./domain/models/vaccine";

export class VaccineService {
  constructor(private readonly repository: VaccineRepository) {}

  async create(data: Partial<Vaccine>): Promise<Vaccine> {
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<Vaccine>): Promise<Vaccine> {
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<Vaccine> {
    return this.repository.delete(id);
  }

  async getAll(): Promise<Vaccine[]> {
    return this.repository.getAll();
  }
}