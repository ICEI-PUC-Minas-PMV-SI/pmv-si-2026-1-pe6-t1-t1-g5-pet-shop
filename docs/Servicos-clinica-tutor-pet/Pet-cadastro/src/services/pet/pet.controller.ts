import { Request, Response } from "express";
import { PetService } from "./pet.service";

export class PetController {
  constructor(private service: PetService) {}

  async create(req: Request, res: Response) {
    const data = await this.service.create(req.body);
    res.json(data);
  }

  async delete(req: Request<{ id: string }>, res: Response) {
    const data = await this.service.delete(req.params.id);
    res.json(data);
  }

  // ✅ NOVO
  async update(req: Request<{ id: string }>, res: Response) {
    try {
      const data = await this.service.update(req.params.id, req.body);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // opcional
  async getAll(req: Request, res: Response) {
    const data = await this.service.getAll();
    res.json(data);
  }
}