export class ProductEntity {
  constructor(
    public id?: string,
    public name?: string,
    public description?: string,
    public price?: number,
    public stock?: number,
    public category?: string,
    public created_at?: Date,
    public updated_at?: Date,
  ) {}
}
