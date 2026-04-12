import { Router, Request, Response } from "express";
import { ClinicController } from "../clinic/clinic.controller";

export class ClinicRoutes {
  public router: Router;

  constructor(private controller: ClinicController) {
    this.router = Router();
    this.init();
  }

  private init(): void {
    // CREATE
    this.router.post("/", (req: Request, res: Response) => {
      return this.controller.create(req, res);
    });

    // LIST
    this.router.get("/", (req: Request, res: Response) => {
      return this.controller.list(req, res);
    });

    // UPDATE
    this.router.put("/:id", (req: Request<{ id: string }>, res: Response) => {
      return this.controller.update(req, res);
    });

    // DELETE
    this.router.delete("/:id", (req: Request<{ id: string }>, res: Response) => {
      return this.controller.delete(req, res);
    });

    // TESTE
    this.router.get("/test", (req: Request, res: Response) => {
      return res.json({ message: "Clinic route funcionando" });
    });
  }
}