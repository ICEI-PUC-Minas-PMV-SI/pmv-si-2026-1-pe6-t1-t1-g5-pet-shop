import { VaccineController } from "./vaccine.controller";
import { VaccineRoutes } from "./vaccine.routes";
import { VaccineService } from "./vaccine.service";
import { VaccineDatasourceImpl } from "./datasources/vaccine.datasource.impl";
import { VaccineRepositoryImpl } from "./repositories/vaccine.repository.impl";
import { VaccineMapper } from "./domain/mappers/vaccine.mapper";
import { VaccineDtoMapper } from "./dto/mappers/vaccine-dto.mapper";

const datasource = new VaccineDatasourceImpl();
const mapper = new VaccineMapper();
const repository = new VaccineRepositoryImpl(datasource, mapper);
const service = new VaccineService(repository);
const dtoMapper = new VaccineDtoMapper();
const controller = new VaccineController(service, dtoMapper);

export const vaccineRoutes = new VaccineRoutes(controller).router;
