/* eslint-disable @typescript-eslint/no-unused-vars */
import { AuthEntity } from "../../datasources/entities/auth.entity";
import { Auth } from "../models/auth";

export class AuthMapper {
  static toDomain(_entity: AuthEntity): Auth {
    return new Auth();
  }
}
