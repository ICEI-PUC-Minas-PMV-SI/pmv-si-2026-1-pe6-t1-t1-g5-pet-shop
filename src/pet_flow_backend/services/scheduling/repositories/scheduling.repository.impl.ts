import { SchedulingDatasource } from "../datasources/scheduling.datasource";
import { SchedulingMapper } from "../domain/mappers/scheduling.mapper";
import { Scheduling } from "../domain/models/scheduling";
import { SchedulingError } from "../domain/errors/scheduling.error";
import { SchedulingRepository } from "./scheduling.repository";

export class SchedulingRepositoryImpl implements SchedulingRepository {
  constructor(
    private readonly datasource: SchedulingDatasource,
    private readonly mapper: SchedulingMapper = new SchedulingMapper(),
  ) {}

  async list(): Promise<Scheduling[]> {
    const { data, error } = await this.datasource.getAll();
    if (error) {
      throw SchedulingError.internal(error.message);
    }

    return this.mapper.toObjects(data || []);
  }

  async getById(id: string): Promise<Scheduling | null> {
    const { data, error } = await this.datasource.getById(id);

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw SchedulingError.internal(error.message);
    }

    if (!data) {
      return null;
    }

    return this.mapper.toObject(data);
  }

  async create(scheduling: Scheduling): Promise<Scheduling> {
    const payload = this.removeUndefinedFields(
      this.mapper.toReversedObject(scheduling),
    );

    const { data, error } = await this.datasource.create(payload);
    if (error || !data) {
      throw SchedulingError.internal(
        error?.message || "Failed to create scheduling",
      );
    }

    return this.mapper.toObject(data);
  }

  async update(
    id: string,
    scheduling: Partial<Scheduling>,
  ): Promise<Scheduling | null> {
    const payload = this.removeUndefinedFields(
      this.mapper.toReversedObject(
        new Scheduling(
          undefined,
          scheduling.clinicId,
          scheduling.tutorId,
          scheduling.petId,
          scheduling.employeeId,
          scheduling.dateTime,
          scheduling.status,
          scheduling.totalValue,
          scheduling.notes,
          undefined,
        ),
      ),
    );

    const { data, error } = await this.datasource.update(id, payload);
    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw SchedulingError.internal(error.message);
    }

    if (!data) {
      return null;
    }

    return this.mapper.toObject(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.datasource.delete(id);
    if (error) {
      throw SchedulingError.internal(error.message);
    }
  }

  private removeUndefinedFields<T extends object>(payload: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined),
    ) as Partial<T>;
  }
}
