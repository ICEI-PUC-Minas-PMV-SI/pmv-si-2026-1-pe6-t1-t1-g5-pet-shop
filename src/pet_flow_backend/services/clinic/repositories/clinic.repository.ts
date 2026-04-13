import { Clinic } from "../domain/models/clinic";

export interface ClinicRepository {
  getClinics(): Promise<Clinic[]>;
  getById(id: string): Promise<Clinic>;
  createClinic(clinic: Partial<Clinic>): Promise<Clinic>;
  updateClinic(id: string, clinic: Partial<Clinic>): Promise<Clinic>;
  deleteClinic(id: string): Promise<void>;
}
