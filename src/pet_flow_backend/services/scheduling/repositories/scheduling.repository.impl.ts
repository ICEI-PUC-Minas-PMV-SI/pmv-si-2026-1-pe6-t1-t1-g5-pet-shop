import { SchedulingDatasource } from "../datasources/scheduling.datasource";
import { SchedulingRepository } from "./scheduling.repository";

export class SchedulingRepositoryImpl implements SchedulingRepository {
  constructor(private readonly datasource: SchedulingDatasource) {}
}
