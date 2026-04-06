export class SchedulingEntity {
  constructor(
    public id?: string,
    public clinic_id?: string,
    public tutor_id?: string,
    public pet_id?: string,
    public employee_id?: string,
    public date_time?: Date,
    public status?: string,
    public total_value?: number,
    public notes?: string,
    public created_at?: Date,
  ) {}
}
