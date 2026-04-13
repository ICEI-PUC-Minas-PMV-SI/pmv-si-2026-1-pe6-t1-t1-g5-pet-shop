import { Request, Response } from "express";
import { VaccineService } from "./vaccine.service";
import { VaccineDtoMapper } from "./dto/mappers/vaccine-dto.mapper";

export class VaccineController {
  constructor(
    private readonly service: VaccineService,
    private readonly mapper: VaccineDtoMapper
  ) {}

  async list(req: Request, res: Response): Promise<void> {
    try {
      const vaccines = await this.service.listAllVaccines();
      const response = this.mapper.toObjects(vaccines);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const vaccine = await this.service.getVaccineById(id);
      const response = this.mapper.toObject(vaccine);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error: "Vaccine not found" });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const vaccine = await this.service.createVaccine(req.body);
      const response = this.mapper.toObject(vaccine);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const vaccine = await this.service.updateVaccine(id, req.body);
      const response = this.mapper.toObject(vaccine);
      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.service.deleteVaccine(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}

