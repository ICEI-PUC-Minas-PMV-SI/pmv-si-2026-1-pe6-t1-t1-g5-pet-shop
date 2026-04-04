import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { AppRouter } from "./routes";
import { errorHandler } from "./shared/middlewares/error.middleware";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));

try {
    const swaggerDocument = require("./swagger_output.json");
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (e) {
    console.log("Swagger documentation not generated yet.");
}

const appRouter = new AppRouter();
app.use("/api/v1", appRouter.router);

app.use(errorHandler);

export { app };
