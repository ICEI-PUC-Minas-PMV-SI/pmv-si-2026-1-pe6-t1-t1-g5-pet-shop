import { AuthEntity } from "../../datasources/entities/auth.entity";
import { Auth } from "../models/auth";

export class AuthMapper {
    static toDomain(entity: AuthEntity): Auth {
        return new Auth();
    }
}
