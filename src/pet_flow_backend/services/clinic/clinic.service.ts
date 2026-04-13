import { ClinicRepository } from "./repositories/clinic.repository";
import { Clinic } from "./domain/models/clinic";

export class ClinicService {
  constructor(private readonly repository: ClinicRepository) {}

  async listAllClinics(): Promise<Clinic[]> {
    return this.repository.getClinics();
  }

  async getClinicById(id: string): Promise<Clinic> {
    if (!id) throw new Error("ID é obrigatório");
    return this.repository.getById(id);
  }

  async createClinic(clinic: Partial<Clinic>): Promise<Clinic> {
    return this.repository.createClinic(clinic);
  }

  async updateClinic(id: string, clinic: Partial<Clinic>): Promise<Clinic> {
    if (!id) throw new Error("ID é obrigatório");
    return this.repository.updateClinic(id, clinic);
  }

  async deleteClinic(id: string): Promise<void> {
    if (!id) throw new Error("ID é obrigatório");
    return this.repository.deleteClinic(id);
  }
}

