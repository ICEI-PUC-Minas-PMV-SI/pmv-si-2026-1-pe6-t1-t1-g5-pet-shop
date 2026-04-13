import { FinancialTransactionDatasource } from "../datasources/financial-transaction.datasource";
import { FinancialTransactionRepository } from "./financial-transaction.repository";
import { FinancialTransaction } from "../domain/models/financial-transaction";
import { FinancialTransactionMapper } from "../domain/mappers/financial-transaction.mapper";
import { Logger } from "../../../shared/utils/logger";

export class FinancialTransactionRepositoryImpl implements FinancialTransactionRepository {
  constructor(
    private readonly datasource: FinancialTransactionDatasource,
    private readonly mapper: FinancialTransactionMapper,
  ) {}

  async getAllFinancials(filters: {
    clinicId?: string;
    employeeId?: string;
  }): Promise<FinancialTransaction[]> {
    try {
      const { data, error } = await this.datasource.getAllFinancials(filters);
      if (error || !data) return [];
      return this.mapper.toObjects(data);
    } catch (error) {
      console.error(error);
      Logger.error(`Error fetching financial transactions:`, error);
      return [];
    }
  }

  async getFinancialById(
    id: string,
    clinicId?: string,
  ): Promise<FinancialTransaction | null> {
    try {
      const { data, error } = await this.datasource.getFinancialById(
        id,
        clinicId,
      );
      if (error || !data) return null;
      return this.mapper.toObject(data);
    } catch (error) {
      console.error(error);
      Logger.error(
        `Error fetching financial transaction with id ${id}:`,
        error,
      );
      return null;
    }
  }

  async create(
    transaction: Partial<FinancialTransaction>,
  ): Promise<FinancialTransaction | null> {
    try {
      const entity = this.mapper.toReversedObject(
        transaction as FinancialTransaction,
      );
      const { data, error } = await this.datasource.create(entity);
      if (error || !data) throw new Error(error?.message || "Failed to create");
      return this.mapper.toObject(data);
    } catch (error) {
      console.error(error);
      Logger.error("Error creating financial transaction:", error);
      throw error;
    }
  }

  async update(
    id: string,
    clinicId: string,
    transaction: Partial<FinancialTransaction>,
  ): Promise<FinancialTransaction | null> {
    try {
      const entity = this.mapper.toReversedObject(
        transaction as FinancialTransaction,
      );
      const { data, error } = await this.datasource.update(
        id,
        clinicId,
        entity,
      );
      if (error || !data) throw new Error(error?.message || "Failed to update");
      return this.mapper.toObject(data);
    } catch (error) {
      console.error(error);
      Logger.error(
        `Error updating financial transaction with id ${id} for clinic ${clinicId}:`,
        error,
      );
      throw error;
    }
  }

  async delete(id: string, clinicId: string): Promise<boolean> {
    try {
      const { error } = await this.datasource.delete(id, clinicId);
      if (error) {
        Logger.error(
          `Failed to delete transaction id ${id} for clinic ${clinicId}: ${error.message}`,
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error(error);
      Logger.error(
        `Error deleting financial transaction with id ${id} for clinic ${clinicId}:`,
        error,
      );
      return false;
    }
  }
}
