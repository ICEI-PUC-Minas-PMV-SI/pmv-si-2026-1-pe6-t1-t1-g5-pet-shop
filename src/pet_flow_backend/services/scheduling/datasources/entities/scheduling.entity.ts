export class SchedulingEntity {
  constructor(
    public id?: string,
    public date?: Date,
    public time?: string,
    public petId?: string,
    public serviceId?: string,
    public employeeId?: string,
    public status?: string,
    public created_at?: Date,
    public updated_at?: Date,
  ) {}
}
