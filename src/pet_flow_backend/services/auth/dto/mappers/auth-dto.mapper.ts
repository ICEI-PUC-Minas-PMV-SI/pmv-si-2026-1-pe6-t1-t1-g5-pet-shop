import { Auth } from "../../domain/models/auth";
import { AuthResponseDto } from "../models/auth-response.dto";

export class AuthDtoMapper {
    static toDto(domain: Auth): AuthResponseDto {
        return {};
    }
}
