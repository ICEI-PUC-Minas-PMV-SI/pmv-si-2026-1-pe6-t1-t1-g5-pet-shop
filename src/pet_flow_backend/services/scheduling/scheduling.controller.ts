import { SchedulingService } from "./scheduling.service";
import { Request, Response } from "express";
import { SchedulingDtoMapper } from "./dto/mappers/scheduling-dto.mapper";
import { SchedulingError } from "./domain/errors/scheduling.error";

export class SchedulingController {
  constructor(
    private readonly service: SchedulingService,
    private readonly mapper: SchedulingDtoMapper = new SchedulingDtoMapper(),
  ) {}

  async list(_req: Request, res: Response): Promise<void> {
    try {
      const schedules = await this.service.list();
      res.status(200).json(this.mapper.toObjects(schedules));
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = this.getParamId(req);
      const scheduling = await this.service.getById(id);
      res.status(200).json(this.mapper.toObject(scheduling));
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const dto = this.mapper.toCreateDto(req.body as Record<string, unknown>);
      const scheduling = await this.service.create(dto);

      res.status(201).json(this.mapper.toObject(scheduling));
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = this.getParamId(req);
      const dto = this.mapper.toUpdateDto(req.body as Record<string, unknown>);
      const scheduling = await this.service.update(id, dto);
      res.status(200).json(this.mapper.toObject(scheduling));
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = this.getParamId(req);
      await this.service.delete(id);
      res.status(204).send();
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private getParamId(req: Request): string {
    const id = req.params.id;
    if (typeof id !== "string" || !id.trim()) {
      throw SchedulingError.badRequest("id path param is required");
    }

    return id;
  }

  private handleError(error: unknown, res: Response): void {
    if (error instanceof SchedulingError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: "Internal server error" });
  }
}
