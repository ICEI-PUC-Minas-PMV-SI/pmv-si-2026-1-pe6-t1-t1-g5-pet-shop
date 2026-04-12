export class Pet {
  constructor(
    public id: string,
    public tutor_id: string,
    public name: string,
    public species?: string,
    public breed?: string,
    public birth_date?: string,
    public size?: string,
    public weight?: string,
    public color?: string,
    public gender?: string,
    public notes?: string,
  ) {}
}