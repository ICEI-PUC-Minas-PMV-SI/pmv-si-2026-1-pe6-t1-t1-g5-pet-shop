import { Router } from "express";
import { VaccineController } from "./vaccine.controller";

export class VaccineRoutes {
    public readonly router: Router = Router();

    constructor(private readonly controller: VaccineController) {
        this.initRoutes();
    }

    private initRoutes(): void {
        // Define routes here
    }
}
