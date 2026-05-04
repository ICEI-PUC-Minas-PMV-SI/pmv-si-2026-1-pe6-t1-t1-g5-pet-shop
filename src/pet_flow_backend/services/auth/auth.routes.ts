import { Router } from "express";
import { AuthController } from "./auth.controller";

export class AuthRoutes {
  public readonly router: Router = Router();

  constructor(private readonly controller: AuthController) {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.post("/login", (req, res) => this.controller.login(req, res));
    this.router.post("/register", (req, res) =>
      this.controller.register(req, res),
    );
    this.router.post("/refresh", (req, res) =>
      this.controller.refresh(req, res),
    );
  }
}
