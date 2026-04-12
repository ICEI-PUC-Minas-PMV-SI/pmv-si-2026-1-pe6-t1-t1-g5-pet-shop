import { Clinic } from "../domain/models/clinic";

export interface ClinicRepository {
  getClinics(): Promise<Clinic[]>;
}