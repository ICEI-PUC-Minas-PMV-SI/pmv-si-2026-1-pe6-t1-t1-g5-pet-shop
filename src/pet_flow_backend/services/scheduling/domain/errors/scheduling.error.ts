export class SchedulingError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "SchedulingError";
  }

  static badRequest(message: string, details?: unknown): SchedulingError {
    return new SchedulingError(message, 400, details);
  }

  static notFound(message: string): SchedulingError {
    return new SchedulingError(message, 404);
  }

  static internal(message = "Internal server error"): SchedulingError {
    return new SchedulingError(message, 500);
  }
}
