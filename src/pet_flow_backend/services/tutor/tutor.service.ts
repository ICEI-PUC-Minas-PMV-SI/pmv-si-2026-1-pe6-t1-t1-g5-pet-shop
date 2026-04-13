import { TutorRepository } from "./repositories/tutor.repository";
import { Tutor } from "./domain/models/tutor";

export class TutorService {
  constructor(private readonly repository: TutorRepository) {}

  async listAllTutors(): Promise<Tutor[]> {
    return this.repository.getAll();
  }

  async getTutorById(id: string): Promise<Tutor> {
    if (!id) throw new Error("ID é obrigatório");
    return this.repository.getById(id);
  }

  async createTutor(tutor: Partial<Tutor>): Promise<Tutor> {
    return this.repository.create(tutor);
  }

  async updateTutor(id: string, tutor: Partial<Tutor>): Promise<Tutor> {
    if (!id) throw new Error("ID é obrigatório");
    return this.repository.update(id, tutor);
  }

  async deleteTutor(id: string): Promise<void> {
    if (!id) throw new Error("ID é obrigatório");
    return this.repository.delete(id);
  }
}
