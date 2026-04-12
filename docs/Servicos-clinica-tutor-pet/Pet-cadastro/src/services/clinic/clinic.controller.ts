import { Request, Response } from "express";
import { ClinicService } from "./clinic.service";

export class ClinicController {
  constructor(private readonly service: ClinicService) {}

  // CREATE
async create(req: Request, res: Response) {
  try {
    const data = await this.service.createClinic(req.body);
    return res.status(201).json(data);
  } catch (error: any) {
    console.error("ERRO REAL:", error); // 👈 MOSTRA NO TERMINAL
    return res.status(400).json({
      error: error.message || error
    });
  }
}
  // LIST
  async list(req: Request, res: Response) {
    try {
      const data = await this.service.listAllClinics();
      return res.json(data);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao listar clínicas" });
    }
  }

  // UPDATE
  async update(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      const data = await this.service.updateClinic(id, req.body);
      return res.json(data);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao atualizar clínica" });
    }
  }

  // DELETE (faltava esse)
  async delete(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      await this.service.deleteClinic(id);
      return res.json({ message: "Clínica removida com sucesso" });
    } catch (error) {
      return res.status(400).json({ error: "Erro ao deletar clínica" });
    }
  }
}