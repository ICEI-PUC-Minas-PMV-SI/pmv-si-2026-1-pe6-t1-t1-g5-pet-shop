export class ServiceEntity {
  constructor(
    public id?: string,
    public name?: string,
    public description?: string,
    public price?: number,
    public duration?: number,
    public created_at?: Date,
    public updated_at?: Date,
  ) {}
}
