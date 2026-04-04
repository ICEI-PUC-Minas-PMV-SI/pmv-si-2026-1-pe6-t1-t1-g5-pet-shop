import { SchedulingRepository } from "./repositories/scheduling.repository";
import { Scheduling } from "./domain/models/scheduling";
import { CreateSchedulingDto } from "./dto/models/create-scheduling.dto";
import { UpdateSchedulingDto } from "./dto/models/update-scheduling.dto";
import { SchedulingError } from "./domain/errors/scheduling.error";

export class SchedulingService {
  constructor(private readonly repository: SchedulingRepository) {}

  async list(): Promise<Scheduling[]> {
    return this.repository.list();
  }

  async getById(id: string): Promise<Scheduling> {
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
    const existing = await this.repository.getById(id);

    if (!existing) {
      throw SchedulingError.notFound("Scheduling not found");
    }

    await this.repository.delete(id);
  }
}
