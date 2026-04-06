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
      fromObject.clinic_id,
      fromObject.tutor_id,
      fromObject.pet_id,
      fromObject.employee_id,
      fromObject.date_time,
      fromObject.status,
      fromObject.total_value,
      fromObject.notes,
      fromObject.created_at,
    );
  }

  toReversedObject(toObject: Scheduling): SchedulingEntity {
    return new SchedulingEntity(
      toObject.id,
      toObject.clinicId,
      toObject.tutorId,
      toObject.petId,
      toObject.employeeId,
      toObject.dateTime,
      toObject.status,
      toObject.totalValue,
      toObject.notes,
      toObject.createdAt,
    );
  }

  toObjects(fromObjects: SchedulingEntity[]): Scheduling[] {
    return fromObjects.map((fromObject) => this.toObject(fromObject));
  }

  toReversedObjects(toObjects: Scheduling[]): SchedulingEntity[] {
    return toObjects.map((toObject) => this.toReversedObject(toObject));
  }
}
