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
      clinicId: fromObject.clinicId || "",
      tutorId: fromObject.tutorId || "",
      petId: fromObject.petId || "",
      employeeId: fromObject.employeeId || "",
      dateTime: fromObject.dateTime || new Date(),
      status: fromObject.status || "",
      totalValue: fromObject.totalValue || 0,
      notes: fromObject.notes || "",
      createdAt: fromObject.createdAt || new Date(),
    };
  }

  toReversedObject(toObject: SchedulingResponseDto): Scheduling {
    return new Scheduling(
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

  toObjects(fromObjects: Scheduling[]): SchedulingResponseDto[] {
    return fromObjects.map((fromObject) => this.toObject(fromObject));
  }

  toReversedObjects(toObjects: SchedulingResponseDto[]): Scheduling[] {
    return toObjects.map((toObject) => this.toReversedObject(toObject));
  }
}
