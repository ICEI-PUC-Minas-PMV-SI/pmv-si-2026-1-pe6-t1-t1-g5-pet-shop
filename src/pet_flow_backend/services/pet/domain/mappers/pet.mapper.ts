import { Mapper, ReversedMapper } from "../../../../shared/utils/mapper";
import { PetEntity } from "../../datasources/entities/pet.entity";
import { Pet } from "../models/pet";

export class PetMapper
  implements Mapper<PetEntity, Pet>, ReversedMapper<PetEntity, Pet>
{
  constructor() {}

  toObject(fromObject: PetEntity): Pet {
    return new Pet(
      fromObject.id,
      fromObject.name,
      fromObject.species,
      fromObject.breed,
      fromObject.age,
      fromObject.weight,
      fromObject.tutorId,
      fromObject.created_at,
      fromObject.updated_at,
    );
  }

  toReversedObject(toObject: Pet): PetEntity {
    return new PetEntity(
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

  toObjects(fromObjects: PetEntity[]): Pet[] {
    return fromObjects.map((fromObject) => this.toObject(fromObject));
  }

  toReversedObjects(toObjects: Pet[]): PetEntity[] {
    return toObjects.map((toObject) => this.toReversedObject(toObject));
  }
}
