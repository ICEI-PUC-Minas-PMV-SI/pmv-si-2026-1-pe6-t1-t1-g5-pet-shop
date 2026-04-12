import { Request, Response } from "express";
import { VaccineService } from "./vaccine.service";

export class VaccineController {
  constructor(private readonly service: VaccineService) {}

  async create(req: Request, res: Response) {
    const data = await this.service.create(req.body);
    res.json(data);
  }

  async update(req: Request<{ id: string }>, res: Response) {
    const data = await this.service.update(req.params.id, req.body);
    res.json(data);
  }

  async delete(req: Request<{ id: string }>, res: Response) {
    const data = await this.service.delete(req.params.id);
    res.json(data);
  }

  async getAll(req: Request, res: Response) {
    const data = await this.service.getAll();
    res.json(data);
  }
}