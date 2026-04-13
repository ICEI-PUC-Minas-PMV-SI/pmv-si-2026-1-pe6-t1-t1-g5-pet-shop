import { PetController } from "./pet.controller";
import { PetRoutes } from "./pet.routes";
import { PetService } from "./pet.service";
import { PetDatasourceImpl } from "./datasources/pet.datasource.impl";
import { PetRepositoryImpl } from "./repositories/pet.repository.impl";
import { PetMapper } from "./domain/mappers/pet.mapper";
import { PetDtoMapper } from "./dto/mappers/pet-dto.mapper";

const datasource = new PetDatasourceImpl();
const mapper = new PetMapper();
const repository = new PetRepositoryImpl(datasource, mapper);
const service = new PetService(repository);
const dtoMapper = new PetDtoMapper();
const controller = new PetController(service, dtoMapper);

export const petRoutes = new PetRoutes(controller).router;
