import { ServiceController } from "./service.controller";
import { ServiceRoutes } from "./service.routes";
import { ServiceService } from "./service.service";
import { ServiceDatasourceImpl } from "./datasources/service.datasource.impl";
import { ServiceRepositoryImpl } from "./repositories/service.repository.impl";

const datasource = new ServiceDatasourceImpl();
const repository = new ServiceRepositoryImpl(datasource);
const service = new ServiceService(repository);
const controller = new ServiceController(service);

export const serviceRoutes = new ServiceRoutes(controller).router;
