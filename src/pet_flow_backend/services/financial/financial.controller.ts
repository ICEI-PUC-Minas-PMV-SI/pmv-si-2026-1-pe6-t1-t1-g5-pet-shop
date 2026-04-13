import { Request, Response } from "express";
import { FinancialService } from "./financial.service";
import { FinancialTransactionDtoMapper } from "./dto/mappers/financial-transaction-dto.mapper";
import { Logger } from "../../shared/utils/logger";

export class FinancialController {
  constructor(
    private readonly service: FinancialService,
    private readonly mapper: FinancialTransactionDtoMapper,
  ) {}

  async getAllFinancials(req: Request, res: Response): Promise<void> {
    try {
      const { clinic_id: clinicId, employee_id: employeeId } = req.body;

      const transactions = await this.service.getAllFinancials({
        clinicId,
        employeeId,
      });
      const response = this.mapper.toObjects(transactions);
      res.status(200).json(response);
    } catch (error) {
      Logger.error(`[FinancialController] getAllFinancials error:`, error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getFinancialById(req: Request, res: Response): Promise<void> {
    try {
      const { id, clinic_id: clinicId } = req.body;

      if (!id || !clinicId) {
        res.status(400).json({ error: "id and clinicId are required in body" });
        return;
      }

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
      const transactionModel = this.mapper.toReversedObject(req.body);
      const transaction = await this.service.create(transactionModel);
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
      const { id, clinic_id: clinicId } = req.body;

      if (!id || !clinicId) {
        res
          .status(400)
          .json({ error: "id and clinic_id are required in request body" });
        return;
      }

      const transactionModel = this.mapper.toReversedObject(req.body);
      const transaction = await this.service.update(
        id,
        clinicId,
        transactionModel,
      );
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
      const { id, clinic_id: clinicId } = req.body;

      if (!id || !clinicId) {
        res
          .status(400)
          .json({ error: "id and clinic_id are required in body" });
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
