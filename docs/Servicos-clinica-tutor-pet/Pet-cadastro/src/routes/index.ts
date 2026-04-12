import { Router } from "express";

export class AppRouter {
  public router = Router();

  use(path: string, route: Router) {
    this.router.use(path, route);
  }
}