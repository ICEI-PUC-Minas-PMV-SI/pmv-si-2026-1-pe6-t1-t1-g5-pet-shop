import { TutorDatasource } from "../datasources/tutor.datasource";
import { TutorRepository } from "./tutor.repository";

export class TutorRepositoryImpl implements TutorRepository {
  constructor(private readonly datasource: TutorDatasource) {}
}
