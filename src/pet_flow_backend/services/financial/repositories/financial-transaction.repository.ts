import { FinancialTransaction } from "../domain/models/financial-transaction";

export interface FinancialTransactionRepository {
  getAll(): Promise<FinancialTransaction[]>;
  getById(id: string): Promise<FinancialTransaction | null>;
  create(
    transaction: Partial<FinancialTransaction>,
  ): Promise<FinancialTransaction | null>;
  update(
    id: string,
    transaction: Partial<FinancialTransaction>,
  ): Promise<FinancialTransaction | null>;
  delete(id: string): Promise<boolean>;
}
