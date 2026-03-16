import { SchedulingController } from "./scheduling.controller";
import { SchedulingRoutes } from "./scheduling.routes";
import { SchedulingService } from "./scheduling.service";
import { SchedulingDatasourceImpl } from "./datasources/scheduling.datasource.impl";
import { SchedulingRepositoryImpl } from "./repositories/scheduling.repository.impl";

const datasource = new SchedulingDatasourceImpl();
const repository = new SchedulingRepositoryImpl(datasource);
const service = new SchedulingService(repository);
const controller = new SchedulingController(service);

export const schedulingRoutes = new SchedulingRoutes(controller).router;
