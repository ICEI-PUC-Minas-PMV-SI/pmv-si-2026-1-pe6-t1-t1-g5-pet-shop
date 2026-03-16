import { AuthController } from "./auth.controller";
import { AuthRoutes } from "./auth.routes";
import { AuthService } from "./auth.service";
import { AuthDatasourceImpl } from "./datasources/auth.datasource.impl";
import { AuthRepositoryImpl } from "./repositories/auth.repository.impl";

const datasource = new AuthDatasourceImpl();
const repository = new AuthRepositoryImpl(datasource);
const service = new AuthService(repository);
const controller = new AuthController(service);

export const authRoutes = new AuthRoutes(controller).router;
