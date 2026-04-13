import { ServiceRepository } from "./service.repository";
import { ServiceDatasource } from "../datasources/service.datasource";
import { ServiceMapper } from "../domain/mappers/service.mapper";
import { Service } from "../domain/models/service";
import { Logger } from "../../../shared/utils/logger";

export class ServiceRepositoryImpl implements ServiceRepository {
  constructor(
    private readonly datasource: ServiceDatasource,
    private readonly mapper: ServiceMapper,
  ) {}

  async getServices(): Promise<Service[]> {
    try {
      const { data, error } = await this.datasource.getAll();
      if (error || !data) return [];
      return this.mapper.toObjects(data);
    } catch (error) {
      Logger.error("Error fetching services:", error);
      return [];
    }
  }

  async getServiceById(id: string): Promise<Service> {
    try {
      const { data, error } = await this.datasource.getById(id);
      if (error || !data) throw new Error("Serviço não encontrado");
      return this.mapper.toObject(data);
    } catch (error) {
      Logger.error(`Error fetching service with id ${id}:`, error);
      throw error;
    }
  }

  async createService(data: Partial<Service>): Promise<Service> {
    try {
      const entity = this.mapper.toReversedObject(data as Service);
      const { data: created, error } = await this.datasource.create(entity);
      if (error || !created)
        throw new Error(error?.message || "Erro ao criar serviço");
      return this.mapper.toObject(created);
    } catch (error) {
      Logger.error("Error creating service:", error);
      throw error;
    }
  }

  async updateService(id: string, data: Partial<Service>): Promise<Service> {
    try {
      const entity = this.mapper.toReversedObject(data as Service);
      const { data: updated, error } = await this.datasource.update(id, entity);
      if (error || !updated)
        throw new Error(error?.message || "Serviço não encontrado");
      return this.mapper.toObject(updated);
    } catch (error) {
      Logger.error(`Error updating service with id ${id}:`, error);
      throw error;
    }
  }

  async deleteService(id: string): Promise<void> {
    try {
      const { error } = await this.datasource.delete(id);
      if (error) throw new Error(error.message);
    } catch (error) {
      Logger.error(`Error deleting service with id ${id}:`, error);
      throw error;
    }
  }
}
