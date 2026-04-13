import { TutorController } from "./tutor.controller";
import { TutorRoutes } from "./tutor.routes";
import { TutorService } from "./tutor.service";
import { TutorDatasourceImpl } from "./datasources/tutor.datasource.impl";
import { TutorRepositoryImpl } from "./repositories/tutor.repository.impl";
import { TutorMapper } from "./domain/mappers/tutor.mapper";
import { TutorDtoMapper } from "./dto/mappers/tutor-dto.mapper";

const datasource = new TutorDatasourceImpl();
const mapper = new TutorMapper();
const repository = new TutorRepositoryImpl(datasource, mapper);
const service = new TutorService(repository);
const dtoMapper = new TutorDtoMapper();
const controller = new TutorController(service, dtoMapper);

export const tutorRoutes = new TutorRoutes(controller).router;
