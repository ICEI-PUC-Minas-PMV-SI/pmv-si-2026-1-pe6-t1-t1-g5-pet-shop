import { Scheduling } from "../domain/models/scheduling";

export interface SchedulingRepository {
  list(): Promise<Scheduling[]>;
  getById(id: string): Promise<Scheduling | null>;
  create(scheduling: Scheduling): Promise<Scheduling>;
  update(
    id: string,
    scheduling: Partial<Scheduling>,
  ): Promise<Scheduling | null>;
  delete(id: string): Promise<void>;
}
