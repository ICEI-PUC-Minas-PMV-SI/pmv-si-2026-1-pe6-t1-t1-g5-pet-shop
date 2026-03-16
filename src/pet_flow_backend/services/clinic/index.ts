import { ClinicController } from "./clinic.controller";
import { ClinicRoutes } from "./clinic.routes";
import { ClinicService } from "./clinic.service";
import { ClinicDatasourceImpl } from "./datasources/clinic.datasource.impl";
import { ClinicRepositoryImpl } from "./repositories/clinic.repository.impl";

const datasource = new ClinicDatasourceImpl();
const repository = new ClinicRepositoryImpl(datasource);
const service = new ClinicService(repository);
const controller = new ClinicController(service);

export const clinicRoutes = new ClinicRoutes(controller).router;
