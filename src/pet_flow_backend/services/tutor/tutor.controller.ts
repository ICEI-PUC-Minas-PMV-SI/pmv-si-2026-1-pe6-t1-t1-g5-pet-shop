import { Request, Response } from "express";
import { TutorService } from "./tutor.service";
import { TutorDtoMapper } from "./dto/mappers/tutor-dto.mapper";

export class TutorController {
  constructor(
    private readonly service: TutorService,
    private readonly mapper: TutorDtoMapper,
  ) {}

  async list(req: Request, res: Response): Promise<void> {
    try {
      const tutors = await this.service.listAllTutors();
      const response = this.mapper.toObjects(tutors);
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const tutor = await this.service.getTutorById(id);
      const response = this.mapper.toObject(tutor);
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: "Tutor not found" });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const tutor = await this.service.createTutor(req.body);
      const response = this.mapper.toObject(tutor);
      res.status(201).json(response);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const tutor = await this.service.updateTutor(id, req.body);
      const response = this.mapper.toObject(tutor);
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await this.service.deleteTutor(id);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
