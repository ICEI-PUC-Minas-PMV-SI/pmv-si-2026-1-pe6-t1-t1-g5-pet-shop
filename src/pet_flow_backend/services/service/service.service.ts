import { ServiceRepository } from "./repositories/service.repository";
import { Service } from "./domain/models/service";

export class ServiceService {
  constructor(private readonly repository: ServiceRepository) {}

  async list(): Promise<Service[]> {
    return this.repository.getServices();
  }

  async findById(id: string): Promise<Service> {
    return this.repository.getServiceById(id);
  }

  async create(data: Partial<Service>): Promise<Service> {
    return this.repository.createService(data);
  }

  async update(id: string, data: Partial<Service>): Promise<Service> {
    return this.repository.updateService(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.repository.deleteService(id);
  }
}
