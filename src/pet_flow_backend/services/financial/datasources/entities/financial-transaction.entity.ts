export class FinancialTransactionEntity {
  constructor(
    public id?: string,
    public description?: string,
    public amount?: number,
    public due_date?: Date,
    public payment_method?: string,
    public status?: string,
    public clinic_id?: string,
    public created_at?: Date,
  ) { }
}
