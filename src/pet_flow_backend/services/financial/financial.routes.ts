import { Router } from "express";
import { FinancialController } from "./financial.controller";

export class FinancialRoutes {
  public readonly router: Router = Router();

  constructor(private readonly controller: FinancialController) {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.get("/all", (req, res) =>
      this.controller.getAllFinancials(req, res),
    );
    this.router.get("/detail", (req, res) =>
      this.controller.getFinancialById(req, res),
    );
    this.router.post("/", (req, res) => this.controller.create(req, res));
    this.router.put("/", (req, res) => this.controller.update(req, res));
    this.router.delete("/", (req, res) => this.controller.delete(req, res));
  }
}
