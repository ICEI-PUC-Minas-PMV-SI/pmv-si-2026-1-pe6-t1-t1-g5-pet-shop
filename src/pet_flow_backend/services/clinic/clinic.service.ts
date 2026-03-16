import { ClinicRepository } from "./repositories/clinic.repository";

export class ClinicService {
  constructor(private readonly repository: ClinicRepository) {}
}
