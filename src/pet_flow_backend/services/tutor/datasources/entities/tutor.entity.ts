export class TutorEntity {
  constructor(
    public id: string,
    public name: string,
    public cpf: string,
    public address: string,
    public phone: string,
    public email: string,
    public clinic_id: string, // <-- Formato exato da DB
    public created_at?: Date,
    public updated_at?: Date
  ) {}
}