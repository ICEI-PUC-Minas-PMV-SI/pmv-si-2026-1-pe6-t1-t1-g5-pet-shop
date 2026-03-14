export class Clinic {
  constructor(
    public id?: string,
    public name?: string,
    public cnpj?: string,
    public address?: string,
    public phone?: string,
    public email?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
