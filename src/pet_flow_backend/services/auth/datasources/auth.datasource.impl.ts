import { AuthDatasource, AuthResult } from "./auth.datasource";
import { supabase } from "../../../config/supabase";

export class AuthDatasourceImpl implements AuthDatasource {
  constructor() { }

  async login(email: string, password: string): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }

  async register(email: string, password: string): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  }
}
