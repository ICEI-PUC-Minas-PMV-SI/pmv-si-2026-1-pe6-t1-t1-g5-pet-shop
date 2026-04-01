import { SchedulingError } from "../../domain/errors/scheduling.error";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const ALLOWED_STATUS = [
  "Agendado",
  "Confirmado",
  "Em Andamento",
  "Concluido",
  "Cancelado",
];

export interface CreateSchedulingDtoProps {
  clinicId: string;
  tutorId: string;
  petId: string;
  employeeId: string;
  dateTime: Date;
  status: string;
  totalValue: number;
  notes?: string;
}

export class CreateSchedulingDto {
  constructor(
    public readonly clinicId: string,
    public readonly tutorId: string,
    public readonly petId: string,
    public readonly employeeId: string,
    public readonly dateTime: Date,
    public readonly status: string,
    public readonly totalValue: number,
    public readonly notes?: string,
  ) {}

  static from(body: Record<string, unknown>): CreateSchedulingDto {
    const clinicId = String(body.clinicId || "").trim();
    const tutorId = String(body.tutorId || "").trim();
    const petId = String(body.petId || "").trim();
    const employeeId = String(body.employeeId || "").trim();
    const status = String(body.status || "").trim();
    const notes = body.notes == null ? undefined : String(body.notes).trim();

    const dateTimeValue = body.dateTime;
    const parsedDate =
      dateTimeValue instanceof Date
        ? dateTimeValue
        : new Date(String(dateTimeValue || ""));

    const totalValueRaw = Number(body.totalValue);

    if (!UUID_REGEX.test(clinicId)) {
      throw SchedulingError.badRequest("clinicId must be a valid UUID");
    }
    if (!UUID_REGEX.test(tutorId)) {
      throw SchedulingError.badRequest("tutorId must be a valid UUID");
    }
    if (!UUID_REGEX.test(petId)) {
      throw SchedulingError.badRequest("petId must be a valid UUID");
    }
    if (!UUID_REGEX.test(employeeId)) {
      throw SchedulingError.badRequest("employeeId must be a valid UUID");
    }
    if (Number.isNaN(parsedDate.getTime())) {
      throw SchedulingError.badRequest("dateTime must be a valid date");
    }
    if (!ALLOWED_STATUS.includes(status)) {
      throw SchedulingError.badRequest(
        `status must be one of: ${ALLOWED_STATUS.join(", ")}`,
      );
    }
    if (!Number.isFinite(totalValueRaw) || totalValueRaw < 0) {
      throw SchedulingError.badRequest(
        "totalValue must be a number greater than or equal to zero",
      );
    }

    const payload: CreateSchedulingDtoProps = {
      clinicId,
      tutorId,
      petId,
      employeeId,
      dateTime: parsedDate,
      status,
      totalValue: totalValueRaw,
      notes,
    };

    return new CreateSchedulingDto(
      payload.clinicId,
      payload.tutorId,
      payload.petId,
      payload.employeeId,
      payload.dateTime,
      payload.status,
      payload.totalValue,
      payload.notes,
    );
  }
}
