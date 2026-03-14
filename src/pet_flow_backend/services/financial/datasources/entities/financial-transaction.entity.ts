export class FinancialTransactionEntity {
  constructor(
    public id?: string,
    public type?: string,
    public amount?: number,
    public date?: Date,
    public description?: string,
    public created_at?: Date,
    public updated_at?: Date,
  ) {}
}
