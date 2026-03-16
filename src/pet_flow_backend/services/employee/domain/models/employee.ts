export class Employee {
  constructor(
    public id?: string,
    public name?: string,
    public cpf?: string,
    public address?: string,
    public phone?: string,
    public email?: string,
    public role?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
