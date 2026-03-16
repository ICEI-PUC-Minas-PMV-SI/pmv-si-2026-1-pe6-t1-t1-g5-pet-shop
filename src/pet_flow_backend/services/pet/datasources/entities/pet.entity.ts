export class PetEntity {
  constructor(
    public id?: string,
    public name?: string,
    public species?: string,
    public breed?: string,
    public age?: number,
    public weight?: number,
    public tutorId?: string,
    public created_at?: Date,
    public updated_at?: Date,
  ) {}
}
