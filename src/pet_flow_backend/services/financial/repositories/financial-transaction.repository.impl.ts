import { FinancialTransactionDatasource } from "../datasources/financial-transaction.datasource";
import { FinancialTransactionRepository } from "./financial-transaction.repository";
import { FinancialTransaction } from "../domain/models/financial-transaction";
import { FinancialTransactionMapper } from "../domain/mappers/financial-transaction.mapper";
import { Logger } from "../../../shared/utils/logger";

export class FinancialTransactionRepositoryImpl implements FinancialTransactionRepository {
  constructor(
    private readonly datasource: FinancialTransactionDatasource,
    private readonly mapper: FinancialTransactionMapper,
  ) { }

  async getAll(): Promise<FinancialTransaction[]> {
    try {
      const { data, error } = await this.datasource.getAll();
      if (error || !data) return [];
      return this.mapper.toObjects(data);
    } catch (error) {
      Logger.error("Error fetching financial transactions:", error);
      return [];
    }
  }

  async getById(id: string): Promise<FinancialTransaction | null> {
    try {
      const { data, error } = await this.datasource.getById(id);
      if (error || !data) return null;
      return this.mapper.toObject(data);
    } catch (error) {
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
      Logger.error("Error creating financial transaction:", error);
      throw error;
    }
  }

  async update(
    id: string,
    transaction: Partial<FinancialTransaction>,
  ): Promise<FinancialTransaction | null> {
    try {
      const entity = this.mapper.toReversedObject(
        transaction as FinancialTransaction,
      );
      const { data, error } = await this.datasource.update(id, entity);
      if (error || !data) throw new Error(error?.message || "Failed to update");
      return this.mapper.toObject(data);
    } catch (error) {
      Logger.error(
        `Error updating financial transaction with id ${id}:`,
        error,
      );
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await this.datasource.delete(id);
      if (error) {
        Logger.error(`Failed to delete transaction id ${id}: ${error.message}`);
        return false;
      }
      return true;
    } catch (error) {
      Logger.error(
        `Error deleting financial transaction with id ${id}:`,
        error,
      );
      return false;
    }
  }
}
