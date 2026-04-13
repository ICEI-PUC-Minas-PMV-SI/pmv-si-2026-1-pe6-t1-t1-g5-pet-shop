import { ClinicController } from "./clinic.controller";
import { ClinicRoutes } from "./clinic.routes";
import { ClinicService } from "./clinic.service";
import { ClinicDatasourceImpl } from "./datasources/clinic.datasource.impl";
import { ClinicRepositoryImpl } from "./repositories/clinic.repository.impl";
import { ClinicMapper } from "./domain/mappers/clinic.mapper";
import { ClinicDtoMapper } from "./dto/mappers/clinic-dto.mapper";

const datasource = new ClinicDatasourceImpl();
const mapper = new ClinicMapper();
const repository = new ClinicRepositoryImpl(datasource, mapper);
const service = new ClinicService(repository);
const dtoMapper = new ClinicDtoMapper();
const controller = new ClinicController(service, dtoMapper);

export const clinicRoutes = new ClinicRoutes(controller).router;
