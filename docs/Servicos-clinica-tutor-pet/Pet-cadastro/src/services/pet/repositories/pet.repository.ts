import { Pet } from "../domain/models/pet";

export interface PetRepository {
  create(data: Partial<Pet>): Promise<Pet>;
  delete(id: string): Promise<Pet>;

  // ✅ NOVO
  update(id: string, data: Partial<Pet>): Promise<Pet>;

  // opcional
  getAll(): Promise<Pet[]>;
}