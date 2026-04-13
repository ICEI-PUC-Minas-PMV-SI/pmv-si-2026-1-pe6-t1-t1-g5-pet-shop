import { VaccineRepository } from "./repositories/vaccine.repository";
import { Vaccine } from "./domain/models/vaccine";

export class VaccineService {
  constructor(private readonly repository: VaccineRepository) {}

  async listAllVaccines(): Promise<Vaccine[]> {
    return this.repository.list();
  }

  async getVaccineById(id: string): Promise<Vaccine> {
    if (!id) throw new Error("ID é obrigatório");
    return this.repository.getById(id);
  }

  async createVaccine(vaccine: Partial<Vaccine>): Promise<Vaccine> {
    return this.repository.create(vaccine);
  }

  async updateVaccine(id: string, vaccine: Partial<Vaccine>): Promise<Vaccine> {
    if (!id) throw new Error("ID é obrigatório");
    return this.repository.update(id, vaccine);
  }

  async deleteVaccine(id: string): Promise<void> {
    if (!id) throw new Error("ID é obrigatório");
    return this.repository.delete(id);
  }
}
