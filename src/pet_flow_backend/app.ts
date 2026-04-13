import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { AppRouter } from "./routes";
import { errorHandler } from "./shared/middlewares/error.middleware";
import swaggerDocument from "./swagger_output.json";
import { VERSION } from "./version";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));

export const API_PREFIX = `/api/v${VERSION.split(".")[0]}`;

app.use(
  `${API_PREFIX}/api-docs`,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument),
);

const appRouter = new AppRouter();
app.use(API_PREFIX, appRouter.router);

app.use(errorHandler);

export { app };
