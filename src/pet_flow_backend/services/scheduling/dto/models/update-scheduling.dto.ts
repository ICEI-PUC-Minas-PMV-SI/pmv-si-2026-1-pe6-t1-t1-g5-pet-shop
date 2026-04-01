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

export class UpdateSchedulingDto {
  constructor(
    public readonly clinicId?: string,
    public readonly tutorId?: string,
    public readonly petId?: string,
    public readonly employeeId?: string,
    public readonly dateTime?: Date,
    public readonly status?: string,
    public readonly totalValue?: number,
    public readonly notes?: string,
  ) {}

  static from(body: Record<string, unknown>): UpdateSchedulingDto {
    const hasAnyField = [
      "clinicId",
      "tutorId",
      "petId",
      "employeeId",
      "dateTime",
      "status",
      "totalValue",
      "notes",
    ].some((key) => Object.prototype.hasOwnProperty.call(body, key));

    if (!hasAnyField) {
      throw SchedulingError.badRequest("At least one field must be provided");
    }

    const clinicId =
      body.clinicId == null ? undefined : String(body.clinicId).trim();
    const tutorId =
      body.tutorId == null ? undefined : String(body.tutorId).trim();
    const petId = body.petId == null ? undefined : String(body.petId).trim();
    const employeeId =
      body.employeeId == null ? undefined : String(body.employeeId).trim();
    const status = body.status == null ? undefined : String(body.status).trim();
    const notes = body.notes == null ? undefined : String(body.notes).trim();

    const dateTime =
      body.dateTime == null
        ? undefined
        : body.dateTime instanceof Date
          ? body.dateTime
          : new Date(String(body.dateTime));

    const totalValue =
      body.totalValue == null ? undefined : Number(body.totalValue);

    if (clinicId && !UUID_REGEX.test(clinicId)) {
      throw SchedulingError.badRequest("clinicId must be a valid UUID");
    }
    if (tutorId && !UUID_REGEX.test(tutorId)) {
      throw SchedulingError.badRequest("tutorId must be a valid UUID");
    }
    if (petId && !UUID_REGEX.test(petId)) {
      throw SchedulingError.badRequest("petId must be a valid UUID");
    }
    if (employeeId && !UUID_REGEX.test(employeeId)) {
      throw SchedulingError.badRequest("employeeId must be a valid UUID");
    }
    if (dateTime && Number.isNaN(dateTime.getTime())) {
      throw SchedulingError.badRequest("dateTime must be a valid date");
    }
    if (status && !ALLOWED_STATUS.includes(status)) {
      throw SchedulingError.badRequest(
        `status must be one of: ${ALLOWED_STATUS.join(", ")}`,
      );
    }
    if (
      totalValue !== undefined &&
      (!Number.isFinite(totalValue) || totalValue < 0)
    ) {
      throw SchedulingError.badRequest(
        "totalValue must be a number greater than or equal to zero",
      );
    }

    return new UpdateSchedulingDto(
      clinicId,
      tutorId,
      petId,
      employeeId,
      dateTime,
      status,
      totalValue,
      notes,
    );
  }
}
