import { Request, Response } from "express";
import { FinancialService } from "./financial.service";
import { FinancialTransactionDtoMapper } from "./dto/mappers/financial-transaction-dto.mapper";
import { Logger } from "../../shared/utils/logger";

export class FinancialController {
  constructor(
    private readonly service: FinancialService,
    private readonly mapper: FinancialTransactionDtoMapper,
  ) { }

  async getAllFinancials(req: Request, res: Response): Promise<void> {
    try {
      const clinicId = req.query.clinicId as string | undefined;
      const employeeId = req.query.employeeId as string | undefined;

      const transactions = await this.service.getAllFinancials({ clinicId, employeeId });
      const response = this.mapper.toObjects(transactions);
      res.status(200).json(response);
    } catch (error) {
      Logger.error(`[FinancialController] getAllFinancials error:`, error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getFinancialById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const clinicId = req.query.clinicId as string | undefined;

      const transaction = await this.service.getFinancialById(id, clinicId);
      if (!transaction) {
        res.status(404).json({ error: "Not Found or Unauthorized" });
        return;
      }
      const response = this.mapper.toObject(transaction);
      res.status(200).json(response);
    } catch (error) {
      Logger.error("[FinancialController] getFinancialById error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const transaction = await this.service.create(req.body);
      if (!transaction) {
        res.status(400).json({ error: "Failed to create" });
        return;
      }
      const response = this.mapper.toObject(transaction);
      res.status(201).json(response);
    } catch (error) {
      Logger.error("[FinancialController] create error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const clinicId = req.body.clinicId as string; // Required in body for security

      if (!clinicId) {
        res.status(400).json({ error: "clinicId is required in request body" });
        return;
      }

      const transaction = await this.service.update(id, clinicId, req.body);
      if (!transaction) {
        res.status(400).json({ error: "Failed to update or not authorized" });
        return;
      }
      const response = this.mapper.toObject(transaction);
      res.status(200).json(response);
    } catch (error) {
      Logger.error("[FinancialController] update error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const clinicId = req.query.clinicId as string;

      if (!clinicId) {
        res.status(400).json({ error: "clinicId is required as a query parameter" });
        return;
      }

      const success = await this.service.delete(id, clinicId);
      if (!success) {
        res.status(400).json({ error: "Failed to delete or not authorized" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      Logger.error("[FinancialController] delete error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
