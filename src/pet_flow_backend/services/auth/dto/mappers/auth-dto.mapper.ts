import { Mapper } from "../../../../shared/utils/mapper";
import { Auth } from "../../domain/models/auth";
import { AuthResponseDto } from "../models/auth-response.dto";

export class AuthDtoMapper implements Mapper<Auth, AuthResponseDto> {
  toObject(fromObject: Auth): AuthResponseDto {
    return {
      user_id: fromObject.userId,
      token: fromObject.token,
      refresh_token: fromObject.refreshToken,
    };
  }

  toObjects(fromObjects: Auth[]): AuthResponseDto[] {
    return fromObjects.map((fromObject) => this.toObject(fromObject));
  }
}
