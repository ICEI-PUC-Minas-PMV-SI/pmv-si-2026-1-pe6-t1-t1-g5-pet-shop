import { DbResult } from "../../../shared/utils/supabase.extensions";
import { Auth } from "../domain/models/auth";

export interface AuthRepository {
  login(email: string, password: string): Promise<DbResult<Auth>>;
  register(email: string, password: string): Promise<DbResult<Auth>>;
}
