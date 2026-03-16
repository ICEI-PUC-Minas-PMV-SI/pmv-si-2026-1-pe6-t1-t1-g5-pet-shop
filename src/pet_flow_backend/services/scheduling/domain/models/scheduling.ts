export class Scheduling {
  constructor(
    public id?: string,
    public date?: Date,
    public time?: string,
    public petId?: string,
    public serviceId?: string,
    public employeeId?: string,
    public status?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
