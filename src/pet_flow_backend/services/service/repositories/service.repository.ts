import { Service } from "../domain/models/service";

export interface ServiceRepository {
  getServices(): Promise<Service[]>;
  getServiceById(id: string): Promise<Service>;
  createService(data: Partial<Service>): Promise<Service>;
  updateService(id: string, data: Partial<Service>): Promise<Service>;
  deleteService(id: string): Promise<void>;
}