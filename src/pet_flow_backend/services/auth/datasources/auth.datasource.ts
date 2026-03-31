import { AuthError, Session, User } from "@supabase/supabase-js";

export interface AuthSessionData {
    user: User | null;
    session: Session | null;
}

export interface AuthResult {
    data: AuthSessionData;
    error: AuthError | null;
}

export interface AuthDatasource {
    login(email: string, password: string): Promise<AuthResult>;
    register(email: string, password: string): Promise<AuthResult>;
}
