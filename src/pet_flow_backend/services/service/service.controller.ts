import { Request, Response } from "express";
import { z } from "zod";
import { ServiceService } from "./service.service";
import { ServiceDtoMapper } from "./dto/mappers/service-dto.mapper";

const createServiceSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  price: z.number().positive("Preço é obrigatório"),
  duration: z.number().positive("Duração é obrigatória"),
});

const updateServiceSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").optional(),
  description: z
    .string()
    .min(10, "Descrição deve ter no mínimo 10 caracteres")
    .optional(),
  price: z.number().positive().optional(),
  duration: z.number().positive().optional(),
});

export class ServiceController {
  constructor(
    private readonly service: ServiceService,
    private readonly mapper: ServiceDtoMapper,
  ) {}

  async list(req: Request, res: Response): Promise<void> {
    try {
      const services = await this.service.list();
      res.status(200).json(this.mapper.toObjects(services));
    } catch (error) {
      res.status(500).json({ error: "Erro interno" });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params["id"] as string;
      if (!id) {
        res.status(400).json({ error: "ID obrigatório" });
        return;
      }
      const service = await this.service.findById(id);
      res.status(200).json(this.mapper.toObject(service));
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const validation = createServiceSchema.safeParse(req.body);
      if (!validation.success) {
        res
          .status(400)
          .json({ error: validation.error.issues.map((i) => i.message) });
        return;
      }
      const service = await this.service.create(validation.data);
      res.status(201).json(this.mapper.toObject(service));
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params["id"] as string;
      if (!id) {
        res.status(400).json({ error: "ID obrigatório" });
        return;
      }
      const validation = updateServiceSchema.safeParse(req.body);
      if (!validation.success) {
        res
          .status(400)
          .json({ error: validation.error.issues.map((i) => i.message) });
        return;
      }
      const service = await this.service.update(id, validation.data);
      res.status(200).json(this.mapper.toObject(service));
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params["id"] as string;
      if (!id) {
        res.status(400).json({ error: "ID obrigatório" });
        return;
      }
      await this.service.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }
}
