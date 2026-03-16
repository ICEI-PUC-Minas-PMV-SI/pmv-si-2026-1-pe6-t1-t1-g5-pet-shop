import { ServiceRepository } from "./repositories/service.repository";

export class ServiceService {
  constructor(private readonly repository: ServiceRepository) {}
}
