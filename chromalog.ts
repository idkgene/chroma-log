type LogLevel = "info" | "warn" | "error" | "debug";
type Color =
  | "black"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white";

interface ChromaLogOptions {
  showTimestamp?: boolean;
  showFileName?: boolean;
  timeFormat?: string;
  customColors?: Record<string, Color>;
}

class ChromaLog {
  private options: ChromaLogOptions;
  private colors: Record<Color, string> = {
    black: "30",
    red: "31",
    green: "32",
    yellow: "33",
    blue: "34",
    magenta: "35",
    cyan: "36",
    white: "37",
  };

  constructor(options: ChromaLogOptions = {}) {
    this.options = {
      showTimestamp: options.showTimestamp ?? true,
      showFileName: options.showFileName ?? true,
      timeFormat: options.timeFormat ?? "HH:mm:ss",
      customColors: options.customColors ?? {},
    };
  }

  log<T>(data: T, level: LogLevel = "info", color?: Color): void {
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
    const defaultColors: Record<LogLevel, Color> = {
      info: "cyan",
      warn: "yellow",
      error: "red",
      debug: "magenta",
    };
    const color = this.options.customColors?.[level] ?? defaultColors[level];
    return this.colors[color];
  }

  private getTimestamp(): string {
    const date = new Date();
    let formatted = this.options.timeFormat ?? "HH:mm:ss";
    formatted = formatted.replace(
      "HH",
      date.getHours().toString().padStart(2, "0")
    );
    formatted = formatted.replace(
      "mm",
      date.getMinutes().toString().padStart(2, "0")
    );
    formatted = formatted.replace(
      "ss",
      date.getSeconds().toString().padStart(2, "0")
    );
    return `[${formatted}] `;
  }

  private getFileName(): string {
    const stack = new Error().stack;
    const callerLine = stack?.split("\n")[3];
    const match = callerLine?.match(/\((.*):\d+:\d+\)$/);
    return match ? `[${match[1]}] ` : "";
  }

  private formatData<T>(data: T, color?: Color): string {
    let formatted =
      typeof data === "object" && data !== null
        ? JSON.stringify(data, null, 2)
        : String(data);

    return color ? this.colorize(formatted, this.colors[color]) : formatted;
  }

  info<T>(data: T, color?: Color): void {
    this.log(data, "info", color);
  }

  warn<T>(data: T, color?: Color): void {
    this.log(data, "warn", color);
  }

  error<T>(data: T, color?: Color): void {
    this.log(data, "error", color);
  }

  debug<T>(data: T, color?: Color): void {
    this.log(data, "debug", color);
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
