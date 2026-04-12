import { TutorRepository } from "./repositories/tutor.repository";
import { Tutor } from "./domain/models/tutor";

export class TutorService {
  constructor(private readonly repository: TutorRepository) {}

  async create(data: Partial<Tutor>): Promise<Tutor> {
    return await this.repository.create(data);
  }

  async delete(id: string): Promise<Tutor> {
    return await this.repository.delete(id);
  }

  async getAll(): Promise<Tutor[]> {
    return await this.repository.getAll();
  }

  // ✅ NOVO
  async update(id: string, data: Partial<Tutor>): Promise<Tutor> {
    return await this.repository.update(id, data);
  }
}