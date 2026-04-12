import { Router } from "express";
import { TutorController } from "./tutor.controller";

export class TutorRoutes {
  public router = Router();

  constructor(private controller: TutorController) {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post("/", (req, res) => this.controller.create(req, res));

    this.router.delete("/:id", (req, res) => this.controller.delete(req, res));

    // ✅ ADICIONADO UPDATE
    this.router.put("/:id", (req, res) => this.controller.update(req, res));

    // opcional
    this.router.get("/", (req, res) => this.controller.getAll(req, res));
  }
}