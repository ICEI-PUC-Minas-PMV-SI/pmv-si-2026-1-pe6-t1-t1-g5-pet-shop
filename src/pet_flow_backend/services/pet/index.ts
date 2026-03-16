import { PetController } from "./pet.controller";
import { PetRoutes } from "./pet.routes";
import { PetService } from "./pet.service";
import { PetDatasourceImpl } from "./datasources/pet.datasource.impl";
import { PetRepositoryImpl } from "./repositories/pet.repository.impl";

const datasource = new PetDatasourceImpl();
const repository = new PetRepositoryImpl(datasource);
const service = new PetService(repository);
const controller = new PetController(service);

export const petRoutes = new PetRoutes(controller).router;
