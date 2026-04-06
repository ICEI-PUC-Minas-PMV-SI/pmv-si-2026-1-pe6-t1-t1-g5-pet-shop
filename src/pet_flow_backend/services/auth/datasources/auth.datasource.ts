import { AuthEntity } from "./entities/auth.entity";
import { DbResult } from "../../../shared/utils/supabase.extensions";

export interface AuthDatasource {
  login(email: string, password: string): Promise<DbResult<AuthEntity>>;
  register(email: string, password: string): Promise<DbResult<AuthEntity>>;
}
