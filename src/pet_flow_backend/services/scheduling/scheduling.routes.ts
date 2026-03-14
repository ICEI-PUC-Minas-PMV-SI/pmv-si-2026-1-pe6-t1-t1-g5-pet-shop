import { Router } from "express";
import { SchedulingController } from "./scheduling.controller";

export class SchedulingRoutes {
    public readonly router: Router = Router();

    constructor(private readonly controller: SchedulingController) {
        this.initRoutes();
    }

    private initRoutes(): void {
        // Define routes here
    }
}
