export class VaccineEntity {
  constructor(
    public id?: string,
    public name?: string,
    public description?: string,
    public batch?: string,
    public expirationDate?: Date,
    public created_at?: Date,
    public updated_at?: Date,
  ) {}
}
