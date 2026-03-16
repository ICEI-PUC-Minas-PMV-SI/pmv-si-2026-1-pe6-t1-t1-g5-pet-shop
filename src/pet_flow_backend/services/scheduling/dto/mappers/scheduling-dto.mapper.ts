import { Mapper, ReversedMapper } from "../../../../shared/utils/mapper";
import { SchedulingResponseDto } from "../models/scheduling-response.dto";
import { Scheduling } from "../../domain/models/scheduling";

export class SchedulingDtoMapper
  implements
    Mapper<Scheduling, SchedulingResponseDto>,
    ReversedMapper<Scheduling, SchedulingResponseDto>
{
  constructor() {}

  toObject(fromObject: Scheduling): SchedulingResponseDto {
    return {
      id: fromObject.id || "",
      date: fromObject.date || new Date(),
      time: fromObject.time || "",
      petId: fromObject.petId || "",
      serviceId: fromObject.serviceId || "",
      employeeId: fromObject.employeeId || "",
      status: fromObject.status || "",
      createdAt: fromObject.createdAt || new Date(),
      updatedAt: fromObject.updatedAt || new Date(),
    };
  }

  toReversedObject(toObject: SchedulingResponseDto): Scheduling {
    return new Scheduling(
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

  toObjects(fromObjects: Scheduling[]): SchedulingResponseDto[] {
    return fromObjects.map((fromObject) => this.toObject(fromObject));
  }

  toReversedObjects(toObjects: SchedulingResponseDto[]): Scheduling[] {
    return toObjects.map((toObject) => this.toReversedObject(toObject));
  }
}
