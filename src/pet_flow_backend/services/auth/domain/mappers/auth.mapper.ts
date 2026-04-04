import { Mapper } from "../../../../shared/utils/mapper";
import { AuthEntity } from "../../datasources/entities/auth.entity";
import { Auth } from "../models/auth";

export class AuthMapper implements Mapper<AuthEntity, Auth> {
  toObject(fromObject: AuthEntity): Auth {
    return new Auth(fromObject.userId, fromObject.token);
  }

  toObjects(fromObjects: AuthEntity[]): Auth[] {
    return fromObjects.map((fromObject) => this.toObject(fromObject));
  }
}
