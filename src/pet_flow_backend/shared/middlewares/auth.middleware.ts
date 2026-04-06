import { Request, Response, NextFunction } from "express";
import { supabase } from "../../config/supabase";
import { Logger } from "../utils/logger";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(401)
        .json({ error: "Missing or invalid Authorization header" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "Token not found" });
      return;
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      Logger.error("[AuthMiddleware] Token validation failed:", error?.message);
      res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
      return;
    }

    (req as Request & { user?: unknown }).user = data.user;

    next();
  } catch (error: unknown) {
    Logger.error(
      "[AuthMiddleware] System routing error:",
      error instanceof Error ? error.message : String(error),
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};
