import { Mapper, ReversedMapper } from "../../../../shared/utils/mapper";
import { ServiceEntity } from "../../datasources/entities/service.entity";
import { Service } from "../models/service";

export class ServiceMapper
  implements
    Mapper<ServiceEntity, Service>,
    ReversedMapper<ServiceEntity, Service>
{
  constructor() {}

  toObject(fromObject: ServiceEntity): Service {
    return new Service(
      fromObject.id,
      fromObject.name,
      fromObject.description,
      fromObject.price,
      fromObject.duration,
      fromObject.created_at,
      fromObject.updated_at,
    );
  }

  toReversedObject(toObject: Service): ServiceEntity {
    return new ServiceEntity(
      toObject.id,
      toObject.name,
      toObject.description,
      toObject.price,
      toObject.duration,
      toObject.createdAt,
      toObject.updatedAt,
    );
  }

  toObjects(fromObjects: ServiceEntity[]): Service[] {
    return fromObjects.map((fromObject) => this.toObject(fromObject));
  }

  toReversedObjects(toObjects: Service[]): ServiceEntity[] {
    return toObjects.map((toObject) => this.toReversedObject(toObject));
  }
}
