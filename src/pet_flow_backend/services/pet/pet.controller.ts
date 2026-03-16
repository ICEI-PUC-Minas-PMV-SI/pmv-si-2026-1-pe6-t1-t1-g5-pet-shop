import { PetService } from "./pet.service";

export class PetController {
  constructor(private readonly service: PetService) {}
}
