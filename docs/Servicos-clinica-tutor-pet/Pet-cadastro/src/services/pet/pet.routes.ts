import { Router } from "express";
import { PetController } from "./pet.controller";

export class PetRoutes {
  public router = Router();

  constructor(private controller: PetController) {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post("/", (req, res) => this.controller.create(req, res));
    
    this.router.delete("/:id", (req, res) => this.controller.delete(req, res));

    // ✅ ADICIONADO (resolve o erro)
    this.router.put("/:id", (req, res) => this.controller.update(req, res));

    // opcional (pra testar)
    this.router.get("/", (req, res) => this.controller.getAll(req, res));
  }
}