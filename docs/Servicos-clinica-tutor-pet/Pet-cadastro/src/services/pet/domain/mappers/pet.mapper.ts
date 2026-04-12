import { PetEntity } from "../../datasources/entities/pet.entity";
import { Pet } from "../models/pet";

export class PetMapper {
  toObject(entity: PetEntity): Pet {
    return new Pet(
      entity.id || "",
      entity.tutor_id,
      entity.name,
      entity.species,
      entity.breed,
      entity.birth_date,
      entity.size,
      entity.weight,
      entity.color,
      entity.gender,
      entity.notes,
    );
  }

  toObjects(entities: PetEntity[]): Pet[] {
    return entities.map((e) => this.toObject(e));
  }

  toEntity(model: any): PetEntity {
    return {
      id: model.id,
      tutor_id: model.tutor_id,
      name: model.name,
      species: model.species,
      breed: model.breed,
      birth_date: model.birth_date,
      size: model.size,
      weight: model.weight,
      color: model.color,
      gender: model.gender,
      notes: model.notes,
    };
  }
}