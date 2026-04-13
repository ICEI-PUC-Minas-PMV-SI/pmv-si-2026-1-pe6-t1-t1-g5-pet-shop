import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { AppRouter } from "./routes";
import { errorHandler } from "./shared/middlewares/error.middleware";
import swaggerDocument from "./swagger_output.json";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));

app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const appRouter = new AppRouter();
app.use("/api/v1", appRouter.router);

app.use(errorHandler);

export { app };
