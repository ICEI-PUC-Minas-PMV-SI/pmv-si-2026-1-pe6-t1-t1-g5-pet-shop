import { FinancialTransactionEntity } from "./entities/financial-transaction.entity";
import { DbResult } from "../../../shared/utils/supabase.extensions";

export interface FinancialTransactionDatasource {
  getAll(): Promise<DbResult<FinancialTransactionEntity[]>>;
  getById(id: string): Promise<DbResult<FinancialTransactionEntity>>;
  create(
    transaction: Partial<FinancialTransactionEntity>,
  ): Promise<DbResult<FinancialTransactionEntity>>;
  update(
    id: string,
    transaction: Partial<FinancialTransactionEntity>,
  ): Promise<DbResult<FinancialTransactionEntity>>;
  delete(id: string): Promise<DbResult<null>>;
}
