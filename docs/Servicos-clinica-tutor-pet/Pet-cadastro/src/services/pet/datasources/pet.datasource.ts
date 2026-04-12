import { PetEntity } from "./entities/pet.entity";

export interface PetDatasource {
  create(pet: PetEntity): Promise<{ data: PetEntity | null; error: any }>;
  delete(id: string): Promise<{ error: any }>;
  findById(id: string): Promise<{ data: PetEntity | null; error: any }>;

  // ✅ NOVO
  update(id: string, data: PetEntity): Promise<{ data: PetEntity | null; error: any }>;

  // opcional
  getAll(): Promise<{ data: PetEntity[] | null; error: any }>;
}