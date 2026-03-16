import { PetRepository } from "./repositories/pet.repository";

export class PetService {
  constructor(private readonly repository: PetRepository) {}
}
