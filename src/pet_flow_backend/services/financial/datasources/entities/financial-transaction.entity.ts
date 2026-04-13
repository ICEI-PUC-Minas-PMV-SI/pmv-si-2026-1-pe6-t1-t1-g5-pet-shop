export class FinancialTransactionEntity {
  constructor(
    public id?: string,
    public scheduling_id?: string,
    public description?: string,
    public amount?: number,
    public payment_method?: string,
    public employee_id?: string,
    public clinic_id?: string,
    public created_at?: Date,
  ) {}
}
