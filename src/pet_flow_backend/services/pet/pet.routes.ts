import { Router } from "express";
import { PetController } from "./pet.controller";

export class PetRoutes {
    public readonly router: Router = Router();

    constructor(private readonly controller: PetController) {
        this.initRoutes();
    }

    private initRoutes(): void {
        // Define routes here
    }
}
