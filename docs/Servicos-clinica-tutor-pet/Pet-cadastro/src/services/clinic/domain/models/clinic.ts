export class Clinic {
  constructor(
    public id: string,
    public name: string,
    public cnpj?: string,
    public email?: string,
    public phone?: string,
    public address?: string,
    public city?: string,
    public state?: string,
    public zip_code?: string,
    public is_active?: boolean,
    public created_at?: string
  ) {}
}