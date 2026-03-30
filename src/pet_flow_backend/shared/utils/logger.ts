export class Logger {
  private static formatMessage(
    level: string,
    message: string,
    ...optionalParams: unknown[]
  ): string {
    const timestamp = new Date().toISOString();
    const extra = optionalParams.length
      ? ` ${JSON.stringify(optionalParams)}`
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
