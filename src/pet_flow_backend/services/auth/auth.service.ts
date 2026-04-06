import { AuthRepository } from "./repositories/auth.repository";
import { Auth } from "./domain/models/auth";
import { DbResult } from "../../shared/utils/supabase.extensions";

export class AuthService {
  constructor(private readonly repository: AuthRepository) {}

  async login(email: string, password: string): Promise<DbResult<Auth>> {
    return this.repository.login(email, password);
  }

  async register(email: string, password: string): Promise<DbResult<Auth>> {
    return this.repository.register(email, password);
  }
}
