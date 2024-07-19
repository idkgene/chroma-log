type LogLevel = "info" | "warn" | "error" | "debug";

interface ChromaLogOptions {
  showTimestamp?: boolean;
  showFileName?: boolean;
}

class ChromaLog {
  private options: ChromaLogOptions;

  constructor(options: ChromaLogOptions = {}) {
    this.options = {
      showTimestamp: options.showTimestamp ?? true,
      showFileName: options.showFileName ?? true,
    };
  }

  log<T>(data: T, level: LogLevel = "info"): void {
    const coloredLevel = this.colorize(
      level.toUpperCase(),
      this.getLevelColor(level)
    );
    const timestamp = this.options.showTimestamp ? this.getTimestamp() : "";
    const fileName = this.options.showFileName ? this.getFileName() : "";

    console.log(
      `${coloredLevel} ${timestamp}${fileName}`,
      this.formatData(data)
    );
  }

  private colorize(text: string, color: string): string {
    return `\x1b[${color}m${text}\x1b[0m`;
  }

  private getLevelColor(level: LogLevel): string {
    const colors: Record<LogLevel, string> = {
      info: "36", // Cyan
      warn: "33", // Yellow
      error: "31", // Red
      debug: "35", // Magenta
    };
    return colors[level];
  }

  private getTimestamp(): string {
    return `[${new Date().toISOString()}] `;
  }

  private getFileName(): string {
    const stack = new Error().stack;
    const callerLine = stack?.split("\n")[3];
    const match = callerLine?.match(/\((.*):\d+:\d+\)$/);
    return match ? `[${match[1]}] ` : "";
  }

  private formatData<T>(data: T): string {
    if (typeof data === "object" && data !== null) {
      return JSON.stringify(data, null, 2);
    }
    return String(data);
  }

  info<T>(data: T): void {
    this.log(data, "info");
  }

  warn<T>(data: T): void {
    this.log(data, "warn");
  }

  error<T>(data: T): void {
    this.log(data, "error");
  }

  debug<T>(data: T): void {
    this.log(data, "debug");
  }

  private timers: Map<string, number> = new Map();

  time(label: string): void {
    this.timers.set(label, performance.now());
  }

  timeEnd(label: string): void {
    const start = this.timers.get(label);
    if (start === undefined) {
      this.warn(`Timer '${label}' does not exist`);
      return;
    }
    const duration = performance.now() - start;
    this.info(`${label}: ${duration.toFixed(2)}ms`);
    this.timers.delete(label);
  }
}

export const chrommaLog = new ChromaLog();
