import { Router } from "express";
import { ClinicController } from "./clinic.controller";

export class ClinicRoutes {
  public readonly router: Router = Router();

  constructor(private readonly controller: ClinicController) {
    this.initRoutes();
  }

  private initRoutes(): void {
    // this.router.get("/", (req, res) => this.controller.list(req, res));
  }
}
