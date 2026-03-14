import { Router } from "express";
import { FinancialController } from "./financial.controller";

export class FinancialRoutes {
    public readonly router: Router = Router();

    constructor(private readonly controller: FinancialController) {
        this.initRoutes();
    }

    private initRoutes(): void {
        // Define routes here
    }
}
