import { Mapper, ReversedMapper } from "../../../../shared/utils/mapper";
import { VaccineEntity } from "../../datasources/entities/vaccine.entity";
import { Vaccine } from "../models/vaccine";

export class VaccineMapper
  implements
    Mapper<VaccineEntity, Vaccine>,
    ReversedMapper<VaccineEntity, Vaccine>
{
  constructor() {}

  toObject(fromObject: VaccineEntity): Vaccine {
    return new Vaccine(
      fromObject.id,
      fromObject.name,
      fromObject.description,
      fromObject.batch,
      fromObject.expirationDate,
      fromObject.created_at,
      fromObject.updated_at,
    );
  }

  toReversedObject(toObject: Vaccine): VaccineEntity {
    return new VaccineEntity(
      toObject.id,
      toObject.name,
      toObject.description,
      toObject.batch,
      toObject.expirationDate,
      toObject.createdAt,
      toObject.updatedAt,
    );
  }

  toObjects(fromObjects: VaccineEntity[]): Vaccine[] {
    return fromObjects.map((fromObject) => this.toObject(fromObject));
  }

  toReversedObjects(toObjects: Vaccine[]): VaccineEntity[] {
    return toObjects.map((toObject) => this.toReversedObject(toObject));
  }
}
