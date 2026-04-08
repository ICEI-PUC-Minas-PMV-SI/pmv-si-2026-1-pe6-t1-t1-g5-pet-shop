import { AuthRepository } from "./auth.repository";
import { AuthDatasource } from "../datasources/auth.datasource";
import { CryptoUtils } from "../../../shared/utils/crypto";
import { Auth } from "../domain/models/auth";
import { AuthMapper } from "../domain/mappers/auth.mapper";
import { DbResult } from "../../../shared/utils/supabase.extensions";

export class AuthRepositoryImpl implements AuthRepository {
  private readonly mapper = new AuthMapper();

  constructor(private readonly datasource: AuthDatasource) {}

  async login(email: string, password: string): Promise<DbResult<Auth>> {
    const encryptedPassword = CryptoUtils.encrypt(password);
    const result = await this.datasource.login(email, encryptedPassword);
    if (result.error) return { data: null, error: result.error };
    return {
      data: result.data ? this.mapper.toObject(result.data) : null,
      error: null,
    };
  }

  async register(email: string, password: string): Promise<DbResult<Auth>> {
    const encryptedPassword = CryptoUtils.encrypt(password);
    const result = await this.datasource.register(email, encryptedPassword);
    if (result.error) return { data: null, error: result.error };
    return {
      data: result.data ? this.mapper.toObject(result.data) : null,
      error: null,
    };
  }
}
