import { AuthDatasource } from "./auth.datasource";
import { supabase } from "../../../config/supabase";
import { AuthEntity } from "./entities/auth.entity";
import { DbResult } from "../../../shared/utils/supabase.extensions";

export class AuthDatasourceImpl implements AuthDatasource {
  async login(email: string, password: string): Promise<DbResult<AuthEntity>> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { data: null, error };

    return {
      data: new AuthEntity(
        data.user?.id || "",
        data.session?.access_token || "",
        data.session?.refresh_token || "",
      ),
      error: null,
    };
  }

  async register(
    email: string,
    password: string,
  ): Promise<DbResult<AuthEntity>> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) return { data: null, error };

    return {
      data: new AuthEntity(
        data.user?.id || "",
        data.session?.access_token || "",
        data.session?.refresh_token || "",
      ),
      error: null,
    };
  }

  async refresh(refreshToken: string): Promise<DbResult<AuthEntity>> {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });
    if (error) return { data: null, error };

    return {
      data: new AuthEntity(
        data.user?.id || "",
        data.session?.access_token || "",
        data.session?.refresh_token || "",
      ),
      error: null,
    };
  }
}
