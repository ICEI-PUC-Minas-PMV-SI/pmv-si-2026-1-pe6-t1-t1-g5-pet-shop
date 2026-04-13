import { Request, Response } from "express";
import { ClinicService } from "./clinic.service";
import { ClinicDtoMapper } from "./dto/mappers/clinic-dto.mapper";

export class ClinicController {
  constructor(
    private readonly service: ClinicService,
    private readonly mapper: ClinicDtoMapper,
  ) {}

  async list(req: Request, res: Response): Promise<void> {
    try {
      const clinics = await this.service.listAllClinics();
      const response = this.mapper.toObjects(clinics);
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const clinic = await this.service.getClinicById(id);
      const response = this.mapper.toObject(clinic);
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: "Clinic not found" });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const clinic = await this.service.createClinic(req.body);
      const response = this.mapper.toObject(clinic);
      res.status(201).json(response);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const clinic = await this.service.updateClinic(id, req.body);
      const response = this.mapper.toObject(clinic);
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.service.deleteClinic(id);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
