import { PetDatasource } from "../datasources/pet.datasource";
import { PetRepository } from "./pet.repository";

export class PetRepositoryImpl implements PetRepository {
  constructor(private readonly datasource: PetDatasource) {}
}
