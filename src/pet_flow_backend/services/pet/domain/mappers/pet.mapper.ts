import { Mapper, ReversedMapper } from "../../../../shared/utils/mapper";
import { PetEntity } from "../../datasources/entities/pet.entity";
import { Pet } from "../models/pet";

export class PetMapper
  implements Mapper<PetEntity, Pet>, ReversedMapper<PetEntity, Pet>
{
  constructor() {}

  private toStringId(value: unknown): string {
    if (typeof value === "string") return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
    return "";
  }

  toObject(fromObject: PetEntity): Pet {
    const raw = fromObject as unknown as Record<string, unknown>;

    const tutorId =
      (fromObject.tutorId as string | undefined) ||
      (raw.tutor_id as string | undefined) ||
      (raw.tutorid as string | undefined) ||
      "";

    return new Pet(
      fromObject.id,
      fromObject.name,
      fromObject.species,
      fromObject.breed,
      fromObject.age,
      fromObject.weight,
      tutorId,
      fromObject.created_at,
      fromObject.updated_at,
    );
  }

  toReversedObject(toObject: Pet): PetEntity {
    const raw = toObject as unknown as Record<string, unknown>;

    const tutorId =
      this.toStringId(toObject.tutorId) ||
      this.toStringId(raw.tutor_id) ||
      this.toStringId(raw.idTutor) ||
      this.toStringId(raw.id_tutor) ||
      this.toStringId(raw.ownerId) ||
      this.toStringId(raw.owner_id) ||
      this.toStringId(raw.responsavelId) ||
      this.toStringId(raw.responsavel_id);

    return new PetEntity(
      toObject.id,
      toObject.name,
      toObject.species,
      toObject.breed,
      toObject.age,
      toObject.weight,
      tutorId,
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
