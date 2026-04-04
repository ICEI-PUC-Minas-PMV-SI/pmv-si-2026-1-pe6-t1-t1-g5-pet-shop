import { FinancialTransactionEntity } from "./entities/financial-transaction.entity";
import { DbResult } from "../../../shared/utils/supabase.extensions";

export interface FinancialTransactionDatasource {
  getAllFinancials(filters: {
    clinicId?: string | undefined;
    employeeId?: string | undefined;
  }): Promise<DbResult<FinancialTransactionEntity[]>>;
  getFinancialById(id: string, clinicId?: string | undefined): Promise<DbResult<FinancialTransactionEntity>>;
  create(
    transaction: Partial<FinancialTransactionEntity>,
  ): Promise<DbResult<FinancialTransactionEntity>>;
  update(
    id: string,
    clinicId: string,
    transaction: Partial<FinancialTransactionEntity>,
  ): Promise<DbResult<FinancialTransactionEntity>>;
  delete(id: string, clinicId: string): Promise<DbResult<null>>;
}
