import { Router } from "express";
import { VaccineController } from "./vaccine.controller";

export class VaccineRoutes {
  public router = Router();

  constructor(private controller: VaccineController) {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post("/", (req, res) => this.controller.create(req, res));
    this.router.put("/:id", (req, res) => this.controller.update(req, res));
    this.router.delete("/:id", (req, res) => this.controller.delete(req, res));
    this.router.get("/", (req, res) => this.controller.getAll(req, res));
  }
}