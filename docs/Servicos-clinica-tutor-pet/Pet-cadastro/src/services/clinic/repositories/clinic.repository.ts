import { Clinic } from "../domain/models/clinic";

export abstract class ClinicRepository {
  abstract create(clinic: Clinic): Promise<Clinic>;
  abstract getClinics(): Promise<Clinic[]>;
  abstract updateClinic(id: string, clinic: Partial<Clinic>): Promise<Clinic>;
  abstract delete(id: string): Promise<void>;
}