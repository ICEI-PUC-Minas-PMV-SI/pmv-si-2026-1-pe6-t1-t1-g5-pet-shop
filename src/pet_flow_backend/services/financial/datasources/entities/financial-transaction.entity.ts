export class FinancialTransactionEntity {
  constructor(
    public idx?: number,
    public id?: string,
    public scheduling_id?: string | null,
    public description?: string,
    public amount?: number,
    public payment_method?: string,
    public employee_id?: string | null,
    public clinic_id?: string,
    public created_at?: Date,
  ) {}
}
