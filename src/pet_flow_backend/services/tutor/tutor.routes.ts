import { Router } from "express";
import { TutorController } from "./tutor.controller";

export class TutorRoutes {
    public readonly router: Router = Router();

    constructor(private readonly controller: TutorController) {
        this.initRoutes();
    }

    private initRoutes(): void {
        // Define routes here
    }
}
