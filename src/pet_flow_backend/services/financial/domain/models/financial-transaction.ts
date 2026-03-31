export class FinancialTransaction {
  constructor(
    public id?: string,
    public description?: string,
    public amount?: number,
    public dueDate?: Date,
    public paymentMethod?: string,
    public status?: string,
    public clinicId?: string,
    public createdAt?: Date,
  ) { }
}
