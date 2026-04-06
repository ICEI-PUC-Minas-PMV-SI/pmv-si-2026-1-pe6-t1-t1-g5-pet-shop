import { FinancialTransactionDatasource } from "./financial-transaction.datasource";
import { FinancialTransactionEntity } from "./entities/financial-transaction.entity";
import {
  supabaseExtensions,
  DbResult,
} from "../../../shared/utils/supabase.extensions";
import { supabase } from "../../../config/supabase";

export class FinancialTransactionDatasourceImpl implements FinancialTransactionDatasource {
  private readonly table = "financial_transaction";

  async getAllFinancials(filters: {
    clinicId?: string | undefined;
    employeeId?: string | undefined;
  }): Promise<DbResult<FinancialTransactionEntity[]>> {
    let query = supabase.from(this.table).select("*");

    if (filters.clinicId) {
      query = query.eq("clinic_id", filters.clinicId);
    }
    if (filters.employeeId) {
      query = query
        .eq("clinic_id", filters.clinicId)
        .eq("employee_id", filters.employeeId);
    }

    const { data, error } = await query;
    return { data: data as FinancialTransactionEntity[], error };
  }

  async getFinancialById(
    id: string,
    clinicId?: string | undefined,
  ): Promise<DbResult<FinancialTransactionEntity>> {
    let query = supabase.from(this.table).select("*").eq("id", id);

    if (clinicId) {
      query = query.eq("clinic_id", clinicId);
    }

    const { data, error } = await query.single();
    return { data: data as FinancialTransactionEntity, error };
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
    clinicId: string,
    transaction: Partial<FinancialTransactionEntity>,
  ): Promise<DbResult<FinancialTransactionEntity>> {
    const { data, error } = await supabase
      .from(this.table)
      .update(transaction)
      .eq("id", id)
      .eq("clinic_id", clinicId)
      .select()
      .single();
    return { data: data as FinancialTransactionEntity, error };
  }

  async delete(id: string, clinicId: string): Promise<DbResult<null>> {
    const { error } = await supabase
      .from(this.table)
      .delete()
      .eq("id", id)
      .eq("clinic_id", clinicId);
    return { data: null, error };
  }
}
