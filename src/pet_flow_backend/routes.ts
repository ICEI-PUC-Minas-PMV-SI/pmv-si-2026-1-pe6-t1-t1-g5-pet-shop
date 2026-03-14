import { Router } from "express";

export class AppRouter {
  public readonly router: Router = Router();

  constructor() {}

  // Method to add individual routes manually or centralized
  public use(path: string, router: Router): void {
    this.router.use(path, router);
  }
}
