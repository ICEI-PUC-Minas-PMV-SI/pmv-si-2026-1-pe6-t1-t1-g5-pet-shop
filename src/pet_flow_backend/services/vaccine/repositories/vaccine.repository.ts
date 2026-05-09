import { Vaccine } from "../domain/models/vaccine";

export interface VaccineRepository {
  list(): Promise<Vaccine[]>;
  listByPet(petId: string): Promise<Vaccine[]>;
  getById(id: string): Promise<Vaccine>;
  create(vaccine: Partial<Vaccine>): Promise<Vaccine>;
  update(id: string, vaccine: Partial<Vaccine>): Promise<Vaccine>;
  delete(id: string): Promise<void>;
}