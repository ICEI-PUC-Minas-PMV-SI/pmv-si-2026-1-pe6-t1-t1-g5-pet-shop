import { Request, Response } from "express";
import { FinancialService } from "./financial.service";
import { FinancialTransactionDtoMapper } from "./dto/mappers/financial-transaction-dto.mapper";
import { Logger } from "../../shared/utils/logger";

export class FinancialController {
  constructor(
    private readonly service: FinancialService,
    private readonly mapper: FinancialTransactionDtoMapper,
  ) { }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const transactions = await this.service.listAll();
      const response = this.mapper.toObjects(transactions);
      res.status(200).json(response);
    } catch (error) {
      Logger.error("[FinancialController] list error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const transaction = await this.service.getById(id);
      if (!transaction) {
        res.status(404).json({ error: "Not Found" });
        return;
      }
      const response = this.mapper.toObject(transaction);
      res.status(200).json(response);
    } catch (error) {
      Logger.error("[FinancialController] getById error:", error);
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
      const transaction = await this.service.update(id, req.body);
      if (!transaction) {
        res.status(400).json({ error: "Failed to update" });
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
      const success = await this.service.delete(id);
      if (!success) {
        res.status(400).json({ error: "Failed to delete" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      Logger.error("[FinancialController] delete error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
