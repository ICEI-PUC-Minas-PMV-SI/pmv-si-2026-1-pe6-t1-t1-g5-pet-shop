import { VaccineRepository } from "./repositories/vaccine.repository";

export class VaccineService {
  constructor(private readonly repository: VaccineRepository) {}
}
