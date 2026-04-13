import { Request, Response, NextFunction } from "express";
import { Logger } from "../utils/logger";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  Logger.error(
    `[${req.method}] ${req.originalUrl} - ${
      err instanceof Error ? err.message : String(err)
    }`,
    err,
  );

  const status = (err as { status?: number })?.status || 500;
  const message = err instanceof Error ? err.message : "Internal Server Error";

  res.status(status).json({ error: message });
};

