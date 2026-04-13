import { Tutor } from "../domain/models/tutor";

export interface TutorRepository {
  getAll(): Promise<Tutor[]>;
  getById(id: string): Promise<Tutor>;
  create(tutor: Partial<Tutor>): Promise<Tutor>;
  update(id: string, tutor: Partial<Tutor>): Promise<Tutor>;
  delete(id: string): Promise<void>;
}

