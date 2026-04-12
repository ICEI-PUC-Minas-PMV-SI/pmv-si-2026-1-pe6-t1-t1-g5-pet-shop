import { ClinicRepository } from "./repositories/clinic.repository";

export class ClinicService {
  constructor(private readonly repository: ClinicRepository) {}

  async createClinic(clinic: any) {
    return this.repository.create(clinic);
  }

  async listAllClinics() {
    return this.repository.getClinics();
  }

  async updateClinic(id: string, clinic: any) {
    return this.repository.updateClinic(id, clinic);
  }

  // ✅ FALTAVA ESSE
  async deleteClinic(id: string) {
    return this.repository.delete(id);
  }
}