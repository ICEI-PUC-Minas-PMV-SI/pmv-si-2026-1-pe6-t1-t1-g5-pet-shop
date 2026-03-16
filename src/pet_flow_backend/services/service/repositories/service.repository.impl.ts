import { ServiceDatasource } from "../datasources/service.datasource";
import { ServiceRepository } from "./service.repository";

export class ServiceRepositoryImpl implements ServiceRepository {
  constructor(private readonly datasource: ServiceDatasource) {}
}
