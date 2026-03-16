export class Service {
  constructor(
    public id?: string,
    public name?: string,
    public description?: string,
    public price?: number,
    public duration?: number,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
