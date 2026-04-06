export class FinancialTransaction {
  constructor(
    public id?: string,
    public schedulingId?: string,
    public category?: string,
    public description?: string,
    public amount?: number,
    public paymentDate?: Date,
    public paymentMethod?: string,
    public employeeId?: string,
    public clinicId?: string,
    public createdAt?: Date,
  ) {}
}
