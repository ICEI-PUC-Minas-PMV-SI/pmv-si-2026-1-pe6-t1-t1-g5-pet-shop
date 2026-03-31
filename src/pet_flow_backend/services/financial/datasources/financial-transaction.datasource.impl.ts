import { FinancialTransactionDatasource } from "./financial-transaction.datasource";
import { FinancialTransactionEntity } from "./entities/financial-transaction.entity";
import {
  supabaseExtensions,
  DbResult,
} from "../../../shared/utils/supabase.extensions";

export class FinancialTransactionDatasourceImpl implements FinancialTransactionDatasource {
  private readonly table = "financial_transaction";

  async getAll(): Promise<DbResult<FinancialTransactionEntity[]>> {
    return supabaseExtensions.getAll<FinancialTransactionEntity>(this.table);
  }

  async getById(id: string): Promise<DbResult<FinancialTransactionEntity>> {
    return supabaseExtensions.getById<FinancialTransactionEntity>(
      this.table,
      id,
    );
  }

  async create(
    transaction: Partial<FinancialTransactionEntity>,
  ): Promise<DbResult<FinancialTransactionEntity>> {
    return supabaseExtensions.create<FinancialTransactionEntity>(
      this.table,
      transaction,
    );
  }

  async update(
    id: string,
    transaction: Partial<FinancialTransactionEntity>,
  ): Promise<DbResult<FinancialTransactionEntity>> {
    return supabaseExtensions.update<FinancialTransactionEntity>(
      this.table,
      id,
      transaction,
    );
  }

  async delete(id: string): Promise<DbResult<null>> {
    return supabaseExtensions.delete(this.table, id);
  }
}
