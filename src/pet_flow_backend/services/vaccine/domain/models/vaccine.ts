export class Vaccine {
  constructor(
    public id?: string,
    public name?: string,
    public description?: string,
    public batch?: string,
    public expirationDate?: Date,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
