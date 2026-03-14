export class FinancialTransaction {
  constructor(
    public id?: string,
    public type?: string,
    public amount?: number,
    public date?: Date,
    public description?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
