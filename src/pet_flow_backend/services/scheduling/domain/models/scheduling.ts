export class Scheduling {
  constructor(
    public id?: string,
    public clinicId?: string,
    public tutorId?: string,
    public petId?: string,
    public employeeId?: string,
    public dateTime?: Date,
    public status?: string,
    public totalValue?: number,
    public notes?: string,
    public createdAt?: Date,
  ) {}
}
