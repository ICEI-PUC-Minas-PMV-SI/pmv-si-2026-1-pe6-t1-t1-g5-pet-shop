import { SchedulingRepository } from "./repositories/scheduling.repository";

export class SchedulingService {
  constructor(private readonly repository: SchedulingRepository) {}
}
