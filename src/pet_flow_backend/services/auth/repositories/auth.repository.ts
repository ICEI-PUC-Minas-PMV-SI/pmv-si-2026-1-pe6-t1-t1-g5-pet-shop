import { AuthResult } from "../datasources/auth.datasource";

export interface AuthRepository {
    login(email: string, password: string): Promise<AuthResult>;
    register(email: string, password: string): Promise<AuthResult>;
}
