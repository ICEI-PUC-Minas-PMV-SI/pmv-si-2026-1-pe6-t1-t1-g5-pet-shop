export class FinancialTransaction {
  constructor(
    public idx?: number,
    public id?: string,
    public schedulingId?: string,
    public description?: string,
    public amount?: number,
    public paymentMethod?: string,
    public employeeId?: string,
    public clinicId?: string,
    public createdAt?: Date,
  ) {}
}
