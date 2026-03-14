import { Mapper, ReversedMapper } from "../../../../shared/utils/mapper";
import { ClinicEntity } from "../../datasources/entities/clinic.entity";
import { Clinic } from "../models/clinic";

export class ClinicMapper
  implements Mapper<ClinicEntity, Clinic>, ReversedMapper<ClinicEntity, Clinic>
{
  constructor() {}

  toObject(fromObject: ClinicEntity): Clinic {
    return new Clinic(
      fromObject.id,
      fromObject.name,
      fromObject.cnpj,
      fromObject.address,
      fromObject.phone,
      fromObject.email,
      fromObject.created_at,
      fromObject.updated_at,
    );
  }

  toReversedObject(toObject: Clinic): ClinicEntity {
    return new ClinicEntity(
      toObject.id,
      toObject.name,
      toObject.cnpj,
      toObject.address,
      toObject.phone,
      toObject.email,
      toObject.createdAt,
      toObject.updatedAt,
    );
  }

  toObjects(fromObjects: ClinicEntity[]): Clinic[] {
    return fromObjects.map((fromObject) => this.toObject(fromObject));
  }

  toReversedObjects(toObjects: Clinic[]): ClinicEntity[] {
    return toObjects.map((toObject) => this.toReversedObject(toObject));
  }
}
