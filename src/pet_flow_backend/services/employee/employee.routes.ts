import { Router } from "express";
import { EmployeeController } from "./employee.controller";

export class EmployeeRoutes {
    public readonly router: Router = Router();

    constructor(private readonly controller: EmployeeController) {
        this.initRoutes();
    }

    private initRoutes(): void {
        // Define routes here
    }
}
