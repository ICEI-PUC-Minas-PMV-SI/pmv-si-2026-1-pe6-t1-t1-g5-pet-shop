import { FinancialTransactionRepository } from "./repositories/financial-transaction.repository";
import { FinancialTransaction } from "./domain/models/financial-transaction";

export class FinancialService {
  constructor(private readonly repository: FinancialTransactionRepository) { }

  async getAllFinancials(filters: {
    clinicId?: string | undefined;
    employeeId?: string | undefined;
  }): Promise<FinancialTransaction[]> {
    return this.repository.getAllFinancials(filters);
  }

  async getFinancialById(id: string, clinicId?: string | undefined): Promise<FinancialTransaction | null> {
    return this.repository.getFinancialById(id, clinicId);
  }

  async create(
    transaction: Partial<FinancialTransaction>,
  ): Promise<FinancialTransaction | null> {
    return this.repository.create(transaction);
  }

  async update(
    id: string,
    clinicId: string,
    transaction: Partial<FinancialTransaction>,
  ): Promise<FinancialTransaction | null> {
    return this.repository.update(id, clinicId, transaction);
  }

  async delete(id: string, clinicId: string): Promise<boolean> {
    return this.repository.delete(id, clinicId);
  }
}
