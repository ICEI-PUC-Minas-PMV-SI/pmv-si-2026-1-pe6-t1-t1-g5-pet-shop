import { AuthDatasourceImpl } from "./datasources/auth.datasource.impl";
import { AuthRepositoryImpl } from "./repositories/auth.repository.impl";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { AuthRoutes } from "./auth.routes";

const authDatasource = new AuthDatasourceImpl();
const authRepository = new AuthRepositoryImpl(authDatasource);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);
const authRoutes = new AuthRoutes(authController).router;

export { authRoutes };
