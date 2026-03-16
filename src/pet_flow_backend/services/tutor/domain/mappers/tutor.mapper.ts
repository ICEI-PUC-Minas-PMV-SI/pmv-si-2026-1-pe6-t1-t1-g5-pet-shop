import { Mapper, ReversedMapper } from "../../../../shared/utils/mapper";
import { TutorEntity } from "../../datasources/entities/tutor.entity";
import { Tutor } from "../models/tutor";

export class TutorMapper
  implements Mapper<TutorEntity, Tutor>, ReversedMapper<TutorEntity, Tutor>
{
  constructor() {}

  toObject(fromObject: TutorEntity): Tutor {
    return new Tutor(
      fromObject.id,
      fromObject.name,
      fromObject.cpf,
      fromObject.address,
      fromObject.phone,
      fromObject.email,
      fromObject.created_at,
      fromObject.updated_at,
    );
  }

  toReversedObject(toObject: Tutor): TutorEntity {
    return new TutorEntity(
      toObject.id,
      toObject.name,
      toObject.cpf,
      toObject.address,
      toObject.phone,
      toObject.email,
      toObject.createdAt,
      toObject.updatedAt,
    );
  }

  toObjects(fromObjects: TutorEntity[]): Tutor[] {
    return fromObjects.map((fromObject) => this.toObject(fromObject));
  }

  toReversedObjects(toObjects: Tutor[]): TutorEntity[] {
    return toObjects.map((toObject) => this.toReversedObject(toObject));
  }
}
