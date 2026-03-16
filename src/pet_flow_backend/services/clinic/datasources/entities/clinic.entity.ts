export class ClinicEntity {
  constructor(
    public id?: string,
    public name?: string,
    public cnpj?: string,
    public address?: string,
    public phone?: string,
    public email?: string,
    public created_at?: Date,
    public updated_at?: Date,
  ) {}
}
