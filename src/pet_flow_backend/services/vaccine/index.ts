import { VaccineController } from "./vaccine.controller";
import { VaccineRoutes } from "./vaccine.routes";
import { VaccineService } from "./vaccine.service";
import { VaccineDatasourceImpl } from "./datasources/vaccine.datasource.impl";
import { VaccineRepositoryImpl } from "./repositories/vaccine.repository.impl";

const datasource = new VaccineDatasourceImpl();
const repository = new VaccineRepositoryImpl(datasource);
const service = new VaccineService(repository);
const controller = new VaccineController(service);

export const vaccineRoutes = new VaccineRoutes(controller).router;
