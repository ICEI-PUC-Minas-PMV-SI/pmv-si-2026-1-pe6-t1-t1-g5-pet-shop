import { ClinicDatasource } from "../datasources/clinic.datasource";
import { ClinicRepository } from "./clinic.repository";

export class ClinicRepositoryImpl implements ClinicRepository {
  constructor(private readonly datasource: ClinicDatasource) {}
}
