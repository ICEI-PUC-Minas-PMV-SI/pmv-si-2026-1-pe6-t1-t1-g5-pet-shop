import { VaccineDatasource } from "../datasources/vaccine.datasource";
import { VaccineRepository } from "./vaccine.repository";

export class VaccineRepositoryImpl implements VaccineRepository {
  constructor(private readonly datasource: VaccineDatasource) {}
}
