export class EmployeeEntity {
  constructor(
    public id?: string,
    public name?: string,
    public cpf?: string,
    public address?: string,
    public phone?: string,
    public email?: string,
    public role?: string,
    public created_at?: Date,
    public updated_at?: Date,
  ) {}
}
