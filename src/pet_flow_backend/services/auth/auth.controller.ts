import { AuthService } from "./auth.service";

export class AuthController {
  constructor(private readonly service: AuthService) {}
}
