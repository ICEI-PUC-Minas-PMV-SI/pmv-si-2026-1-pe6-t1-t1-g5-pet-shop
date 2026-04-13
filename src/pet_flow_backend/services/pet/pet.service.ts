import { PetRepository } from "./repositories/pet.repository";
import { Pet } from "./domain/models/pet";

export class PetService {
  constructor(private readonly repository: PetRepository) {}

  async listAllPets(): Promise<Pet[]> {
    return this.repository.getAll();
  }

  async getPetById(id: string): Promise<Pet> {
    if (!id) throw new Error("ID é obrigatório");
    return this.repository.getById(id);
  }

  async createPet(pet: Partial<Pet>): Promise<Pet> {
    return this.repository.create(pet);
  }

  async updatePet(id: string, pet: Partial<Pet>): Promise<Pet> {
    if (!id) throw new Error("ID é obrigatório");
    return this.repository.update(id, pet);
  }

  async deletePet(id: string): Promise<void> {
    if (!id) throw new Error("ID é obrigatório");
    return this.repository.delete(id);
  }
}

