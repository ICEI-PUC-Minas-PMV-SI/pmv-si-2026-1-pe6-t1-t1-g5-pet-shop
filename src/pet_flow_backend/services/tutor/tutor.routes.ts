import { Router } from "express";
import { TutorController } from "./tutor.controller";

export class TutorRoutes {
  public readonly router: Router = Router();

  constructor(private readonly controller: TutorController) {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.get("/", (req, res) => this.controller.list(req, res));
    this.router.get("/:id", (req, res) => this.controller.getById(req, res));
    this.router.post("/", (req, res) => this.controller.create(req, res));
    this.router.put("/:id", (req, res) => this.controller.update(req, res));
    this.router.delete("/:id", (req, res) => this.controller.delete(req, res));
  }
}
