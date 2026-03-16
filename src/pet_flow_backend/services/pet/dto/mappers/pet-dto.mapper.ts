import { Mapper, ReversedMapper } from "../../../../shared/utils/mapper";
import { PetResponseDto } from "../models/pet-response.dto";
import { Pet } from "../../domain/models/pet";

export class PetDtoMapper
  implements Mapper<Pet, PetResponseDto>, ReversedMapper<Pet, PetResponseDto>
{
  constructor() {}

  toObject(fromObject: Pet): PetResponseDto {
    return {
      id: fromObject.id || "",
      name: fromObject.name || "",
      species: fromObject.species || "",
      breed: fromObject.breed || "",
      age: fromObject.age || 0,
      weight: fromObject.weight || 0,
      tutorId: fromObject.tutorId || "",
      createdAt: fromObject.createdAt || new Date(),
      updatedAt: fromObject.updatedAt || new Date(),
    };
  }

  toReversedObject(toObject: PetResponseDto): Pet {
    return new Pet(
      toObject.id,
      toObject.name,
      toObject.species,
      toObject.breed,
      toObject.age,
      toObject.weight,
      toObject.tutorId,
      toObject.createdAt,
      toObject.updatedAt,
    );
  }

  toObjects(fromObjects: Pet[]): PetResponseDto[] {
    return fromObjects.map((fromObject) => this.toObject(fromObject));
  }

  toReversedObjects(toObjects: PetResponseDto[]): Pet[] {
    return toObjects.map((toObject) => this.toReversedObject(toObject));
  }
}
