import { Router } from "express";
import { ServiceController } from "./service.controller";

export class ServiceRoutes {
  public readonly router = Router();

  constructor(private readonly controller: ServiceController) {
    this.init();
  }

  private init() {
    this.router.get("/", this.controller.list.bind(this.controller));
    this.router.get("/:id", this.controller.findById.bind(this.controller));
    this.router.post("/", this.controller.create.bind(this.controller));
    this.router.put("/:id", this.controller.update.bind(this.controller));
    this.router.delete("/:id", this.controller.delete.bind(this.controller));
  }
}