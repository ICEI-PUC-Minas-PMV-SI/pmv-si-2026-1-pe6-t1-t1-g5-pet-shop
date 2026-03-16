import { TutorController } from "./tutor.controller";
import { TutorRoutes } from "./tutor.routes";
import { TutorService } from "./tutor.service";
import { TutorDatasourceImpl } from "./datasources/tutor.datasource.impl";
import { TutorRepositoryImpl } from "./repositories/tutor.repository.impl";

const datasource = new TutorDatasourceImpl();
const repository = new TutorRepositoryImpl(datasource);
const service = new TutorService(repository);
const controller = new TutorController(service);

export const tutorRoutes = new TutorRoutes(controller).router;
