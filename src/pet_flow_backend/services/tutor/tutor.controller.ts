import { Request, Response } from "express";
import { TutorService } from "./tutor.service";
import { TutorDtoMapper } from "./dto/mappers/tutor-dto.mapper";
import { EmployeeService } from "../employee/employee.service";
import { supabaseExtensions } from "../../shared/utils/supabase.extensions";

export class TutorController {
  constructor(
    private readonly service: TutorService,
    private readonly mapper: TutorDtoMapper,
    private readonly employeeService: EmployeeService,
  ) {}

  private async resolveClinicId(req: Request): Promise<string | null> {
    const fromBody = req.body?.clinic_id || req.body?.clinicId;
    if (fromBody) return fromBody;

    const user = (req as Request & { user?: { email?: string } }).user;
    const email = user?.email;
    if (!email) return null;

    // Try employee's clinic_id first
    try {
      const employee = await this.employeeService.getEmployeeByEmail(email);
      if (employee.clinicId) return employee.clinicId;
    } catch {
      // employee not found, continue to clinic lookup
    }

    // Fallback: find clinic registered with same email
    try {
      const { data } = await supabaseExtensions.findByColumnIlike<{
        id: string;
      }>("clinic", "email", email);
      if (data && data.length > 0) return data[0]?.id ?? null;
    } catch {
      // no clinic found
    }

    return null;
  }

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
      const clinicId = await this.resolveClinicId(req);
      if (!clinicId) {
        res
          .status(400)
          .json({ error: "Clínica não encontrada para este usuário" });
        return;
      }
      const tutor = await this.service.createTutor({
        ...req.body,
        clinic_id: clinicId,
      });
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
      const clinicId = await this.resolveClinicId(req);
      const tutor = await this.service.updateTutor(id, {
        ...req.body,
        ...(clinicId && { clinic_id: clinicId }),
      });
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
