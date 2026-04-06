import { Mapper, ReversedMapper } from "../../../../shared/utils/mapper";
import { SchedulingResponseDto } from "../models/scheduling-response.dto";
import { CreateSchedulingDto } from "../models/create-scheduling.dto";
import { UpdateSchedulingDto } from "../models/update-scheduling.dto";
import { Scheduling } from "../../domain/models/scheduling";
import { SchedulingError } from "../../domain/errors/scheduling.error";

const ALLOWED_STATUS = [
  "Agendado",
  "Confirmado",
  "Em Andamento",
  "Concluido",
  "Cancelado",
];

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

  toCreateDto(body: Record<string, unknown>): CreateSchedulingDto {
    const clinicId = this.parseRequiredString(body, "clinicId");
    const tutorId = this.parseRequiredString(body, "tutorId");
    const petId = this.parseRequiredString(body, "petId");
    const employeeId = this.parseRequiredString(body, "employeeId");
    const dateTime = this.parseDate(body.dateTime, "dateTime");
    const status = this.parseStatus(body.status);
    const totalValue = this.parseTotalValue(body.totalValue);
    const notes = this.parseNullableString(body.notes);

    return {
      clinicId,
      tutorId,
      petId,
      employeeId,
      dateTime,
      status,
      totalValue,
      notes,
    };
  }

  toUpdateDto(body: Record<string, unknown>): UpdateSchedulingDto {
    this.ensureRequiredFields(body, [
      "clinicId",
      "tutorId",
      "petId",
      "employeeId",
      "dateTime",
      "status",
      "totalValue",
      "notes",
    ]);

    return {
      clinicId: this.parseRequiredString(body, "clinicId"),
      tutorId: this.parseRequiredString(body, "tutorId"),
      petId: this.parseRequiredString(body, "petId"),
      employeeId: this.parseRequiredString(body, "employeeId"),
      dateTime: this.parseDate(body.dateTime, "dateTime"),
      status: this.parseStatus(body.status),
      totalValue: this.parseTotalValue(body.totalValue),
      notes: this.parseNullableString(body.notes),
    };
  }

  private ensureRequiredFields(
    body: Record<string, unknown>,
    fields: string[],
  ): void {
    for (const field of fields) {
      if (!Object.prototype.hasOwnProperty.call(body, field)) {
        throw SchedulingError.badRequest(`${field} is required`);
      }
    }
  }

  private parseRequiredString(
    body: Record<string, unknown>,
    field: string,
  ): string {
    const value = body[field];
    if (value == null) {
      throw SchedulingError.badRequest(`${field} is required`);
    }

    const parsed = String(value).trim();
    if (!parsed) {
      throw SchedulingError.badRequest(`${field} is required`);
    }

    return parsed;
  }

  private parseDate(value: unknown, field: string): Date {
    const parsedDate = value instanceof Date ? value : new Date(String(value));
    if (Number.isNaN(parsedDate.getTime())) {
      throw SchedulingError.badRequest(`${field} must be a valid date`);
    }

    return parsedDate;
  }

  private parseStatus(value: unknown): string {
    const status = String(value ?? "").trim();
    if (!ALLOWED_STATUS.includes(status)) {
      throw SchedulingError.badRequest(
        `status must be one of: ${ALLOWED_STATUS.join(", ")}`,
      );
    }

    return status;
  }

  private parseTotalValue(value: unknown): number {
    const totalValue = Number(value);
    if (!Number.isFinite(totalValue) || totalValue < 0) {
      throw SchedulingError.badRequest(
        "totalValue must be a number greater than or equal to zero",
      );
    }

    return totalValue;
  }

  private parseNullableString(value: unknown): string | null {
    if (value == null) {
      return null;
    }

    return String(value).trim();
  }
}
