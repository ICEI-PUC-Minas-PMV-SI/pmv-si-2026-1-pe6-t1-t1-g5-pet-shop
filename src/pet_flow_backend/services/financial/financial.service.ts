import { FinancialTransactionRepository } from "./repositories/financial-transaction.repository";
import { FinancialTransaction } from "./domain/models/financial-transaction";

export class FinancialService {
  constructor(private readonly repository: FinancialTransactionRepository) {}

  async listAll(): Promise<FinancialTransaction[]> {
    return this.repository.getAll();
  }

  async getById(id: string): Promise<FinancialTransaction | null> {
    return this.repository.getById(id);
  }

  async create(
    transaction: Partial<FinancialTransaction>,
  ): Promise<FinancialTransaction | null> {
    return this.repository.create(transaction);
  }

  async update(
    id: string,
    transaction: Partial<FinancialTransaction>,
  ): Promise<FinancialTransaction | null> {
    return this.repository.update(id, transaction);
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}
