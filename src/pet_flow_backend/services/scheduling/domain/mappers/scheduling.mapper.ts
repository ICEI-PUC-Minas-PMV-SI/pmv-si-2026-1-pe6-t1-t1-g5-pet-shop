import { Mapper, ReversedMapper } from "../../../../shared/utils/mapper";
import { SchedulingEntity } from "../../datasources/entities/scheduling.entity";
import { Scheduling } from "../models/scheduling";

export class SchedulingMapper
  implements
    Mapper<SchedulingEntity, Scheduling>,
    ReversedMapper<SchedulingEntity, Scheduling>
{
  constructor() {}

  toObject(fromObject: SchedulingEntity): Scheduling {
    return new Scheduling(
      fromObject.id,
      fromObject.date,
      fromObject.time,
      fromObject.petId,
      fromObject.serviceId,
      fromObject.employeeId,
      fromObject.status,
      fromObject.created_at,
      fromObject.updated_at,
    );
  }

  toReversedObject(toObject: Scheduling): SchedulingEntity {
    return new SchedulingEntity(
      toObject.id,
      toObject.date,
      toObject.time,
      toObject.petId,
      toObject.serviceId,
      toObject.employeeId,
      toObject.status,
      toObject.createdAt,
      toObject.updatedAt,
    );
  }

  toObjects(fromObjects: SchedulingEntity[]): Scheduling[] {
    return fromObjects.map((fromObject) => this.toObject(fromObject));
  }

  toReversedObjects(toObjects: Scheduling[]): SchedulingEntity[] {
    return toObjects.map((toObject) => this.toReversedObject(toObject));
  }
}
