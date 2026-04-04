import { ServiceDatasourceImpl } from "./datasources/service.datasource.impl";
import { ServiceMapper } from "./domain/mappers/service.mapper";
import { ServiceRepositoryImpl } from "./repositories/service.repository.impl";
import { ServiceService } from "./service.service";
import { ServiceDtoMapper } from "./dto/mappers/service-dto.mapper";
import { ServiceController } from "./service.controller";
import { ServiceRoutes } from "./service.routes";

const datasource = new ServiceDatasourceImpl();
const mapper = new ServiceMapper();
const repository = new ServiceRepositoryImpl(datasource, mapper);
const service = new ServiceService(repository);
const dtoMapper = new ServiceDtoMapper();
const controller = new ServiceController(service, dtoMapper);
const routes = new ServiceRoutes(controller);

export const serviceRoutes = routes.router;