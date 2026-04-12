import { Vaccine } from "../domain/models/vaccine";

export interface VaccineRepository {
  create(data: Partial<Vaccine>): Promise<Vaccine>;
  update(id: string, data: Partial<Vaccine>): Promise<Vaccine>;
  delete(id: string): Promise<Vaccine>;
  getAll(): Promise<Vaccine[]>;
}