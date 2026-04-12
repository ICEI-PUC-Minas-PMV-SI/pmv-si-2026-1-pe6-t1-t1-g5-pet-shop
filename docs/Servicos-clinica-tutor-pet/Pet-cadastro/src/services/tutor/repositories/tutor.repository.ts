import { Tutor } from "../domain/models/tutor";

export interface TutorRepository {
  create(data: Partial<Tutor>): Promise<Tutor>;
  delete(id: string): Promise<Tutor>;
  getAll(): Promise<Tutor[]>;
  
  // ✅ NOVO
  update(id: string, data: Partial<Tutor>): Promise<Tutor>;
}