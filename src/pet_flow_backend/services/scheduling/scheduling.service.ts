import { SchedulingRepository } from "./repositories/scheduling.repository";
import { Scheduling } from "./domain/models/scheduling";
import { CreateSchedulingDto } from "./dto/models/create-scheduling.dto";
import { UpdateSchedulingDto } from "./dto/models/update-scheduling.dto";
import { SchedulingError } from "./domain/errors/scheduling.error";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class SchedulingService {
  constructor(private readonly repository: SchedulingRepository) {}

  async list(): Promise<Scheduling[]> {
    return this.repository.list();
  }

  async getById(id: string): Promise<Scheduling> {
    this.validateId(id);
    const scheduling = await this.repository.getById(id);

    if (!scheduling) {
      throw SchedulingError.notFound("Scheduling not found");
    }

    return scheduling;
  }

  async create(dto: CreateSchedulingDto): Promise<Scheduling> {
    const scheduling = new Scheduling(
      undefined,
      dto.clinicId,
      dto.tutorId,
      dto.petId,
      dto.employeeId,
      dto.dateTime,
      dto.status,
      dto.totalValue,
      dto.notes,
    );

    return this.repository.create(scheduling);
  }

  async update(id: string, dto: UpdateSchedulingDto): Promise<Scheduling> {
    this.validateId(id);

    const updated = await this.repository.update(id, {
      clinicId: dto.clinicId,
      tutorId: dto.tutorId,
      petId: dto.petId,
      employeeId: dto.employeeId,
      dateTime: dto.dateTime,
      status: dto.status,
      totalValue: dto.totalValue,
      notes: dto.notes,
    });

    if (!updated) {
      throw SchedulingError.notFound("Scheduling not found");
    }

    return updated;
  }

  async delete(id: string): Promise<void> {
    this.validateId(id);
    const existing = await this.repository.getById(id);

    if (!existing) {
      throw SchedulingError.notFound("Scheduling not found");
    }

    await this.repository.delete(id);
  }

  private validateId(id: string): void {
    if (!UUID_REGEX.test(id)) {
      throw SchedulingError.badRequest("id must be a valid UUID");
    }
  }
}
