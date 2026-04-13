import { Pet } from "../domain/models/pet";

export interface PetRepository {
  getAll(): Promise<Pet[]>;
  getById(id: string): Promise<Pet>;
  create(pet: Partial<Pet>): Promise<Pet>;
  update(id: string, pet: Partial<Pet>): Promise<Pet>;
  delete(id: string): Promise<void>;
}
