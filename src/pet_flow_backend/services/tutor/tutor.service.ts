import { TutorRepository } from "./repositories/tutor.repository";

export class TutorService {
  constructor(private readonly repository: TutorRepository) {}
}
