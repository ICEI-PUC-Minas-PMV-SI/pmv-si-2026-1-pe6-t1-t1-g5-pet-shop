import { FinancialTransaction } from "../domain/models/financial-transaction";

export interface FinancialTransactionRepository {
  getAllFinancials(filters: {
    clinicId?: string | undefined;
    employeeId?: string | undefined;
  }): Promise<FinancialTransaction[]>;
  getFinancialById(id: string, clinicId?: string | undefined): Promise<FinancialTransaction | null>;
  create(
    transaction: Partial<FinancialTransaction>,
  ): Promise<FinancialTransaction | null>;
  update(
    id: string,
    clinicId: string,
    transaction: Partial<FinancialTransaction>,
  ): Promise<FinancialTransaction | null>;
  delete(id: string, clinicId: string): Promise<boolean>;
}
