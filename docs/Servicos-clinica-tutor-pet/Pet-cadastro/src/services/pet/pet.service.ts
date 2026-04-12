import { PetRepository } from "./repositories/pet.repository";
import { Pet } from "./domain/models/pet";

export class PetService {
  constructor(private repository: PetRepository) {}

  async create(data: Partial<Pet>) {
    return this.repository.create(data);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }

  // ✅ NOVO
  async update(id: string, data: Partial<Pet>) {
    return this.repository.update(id, data);
  }

  // opcional
  async getAll() {
    return this.repository.getAll();
  }
}