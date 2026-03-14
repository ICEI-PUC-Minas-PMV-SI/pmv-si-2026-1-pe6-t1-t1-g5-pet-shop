import { Router } from "express";
import { ServiceController } from "./service.controller";

export class ServiceRoutes {
    public readonly router: Router = Router();

    constructor(private readonly controller: ServiceController) {
        this.initRoutes();
    }

    private initRoutes(): void {
        // Define routes here
    }
}
