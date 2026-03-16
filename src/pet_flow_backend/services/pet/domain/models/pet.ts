export class Pet {
  constructor(
    public id?: string,
    public name?: string,
    public species?: string,
    public breed?: string,
    public age?: number,
    public weight?: number,
    public tutorId?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
