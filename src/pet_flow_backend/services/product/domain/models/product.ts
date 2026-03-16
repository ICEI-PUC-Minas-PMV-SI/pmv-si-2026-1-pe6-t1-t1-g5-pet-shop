export class Product {
  constructor(
    public id?: string,
    public name?: string,
    public description?: string,
    public price?: number,
    public stock?: number,
    public category?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
