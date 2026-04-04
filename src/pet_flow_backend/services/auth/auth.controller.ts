import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { Logger } from "../../shared/utils/logger";
import { AuthDtoMapper } from "./dto/mappers/auth-dto.mapper";

export class AuthController {
  private readonly mapper = new AuthDtoMapper();

  constructor(private readonly service: AuthService) { }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      const { data, error } = await this.service.login(email, password);

      if (error) {
        res.status(401).json({ error: error.message });
        return;
      }

      if (!data) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      res.status(200).json(this.mapper.toObject(data));
    } catch (err: any) {
      Logger.error("[AuthController] login error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      const { data, error } = await this.service.register(email, password);

      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }

      if (!data) {
        res.status(400).json({ error: "Registration failed" });
        return;
      }

      res.status(201).json(this.mapper.toObject(data));
    } catch (err: any) {
      Logger.error("[AuthController] register error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
