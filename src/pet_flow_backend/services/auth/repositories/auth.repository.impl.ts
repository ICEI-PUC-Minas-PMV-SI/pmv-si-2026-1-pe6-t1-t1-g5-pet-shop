import { AuthDatasource } from "../datasources/auth.datasource";
import { AuthRepository } from "./auth.repository";

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly datasource: AuthDatasource) {}
}
