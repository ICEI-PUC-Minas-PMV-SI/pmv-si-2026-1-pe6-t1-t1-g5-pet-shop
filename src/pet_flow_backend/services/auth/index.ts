import { AuthController } from "./auth.controller";
import { AuthRoutes } from "./auth.routes";
import { AuthService } from "./auth.service";

const service = new AuthService();
const controller = new AuthController(service);

export const authRoutes = new AuthRoutes(controller).router;
