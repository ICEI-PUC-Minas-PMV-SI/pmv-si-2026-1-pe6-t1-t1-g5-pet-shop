import util from "node:util";

export class Logger {
  private static serializeParam(value: unknown): string {
    if (value instanceof Error) {
      return `${value.name}: ${value.message}`;
    }
    return util.inspect(value, { depth: null, compact: true, sorted: true });
  }

  private static formatMessage(
    level: string,
    message: string,
    ...optionalParams: unknown[]
  ): string {
    const timestamp = new Date().toISOString();
    const extra = optionalParams.length
      ? ` ${optionalParams.map(this.serializeParam).join(" ")}`
      : "";
    return `[${timestamp}] [${level}] ${message}${extra}\n`;
  }

  static info(message: string, ...optionalParams: unknown[]): void {
    process.stdout.write(
      this.formatMessage("INFO", message, ...optionalParams),
    );
  }

  static warn(message: string, ...optionalParams: unknown[]): void {
    process.stdout.write(
      this.formatMessage("WARN", message, ...optionalParams),
    );
  }

  static error(message: string, ...optionalParams: unknown[]): void {
    process.stderr.write(
      this.formatMessage("ERROR", message, ...optionalParams),
    );
  }
}
