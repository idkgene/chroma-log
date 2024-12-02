import { DEFAULT_OPTIONS, LOG_LEVELS } from "./constants/defaults";
import type { LogLevel, LogOptions } from "./types/options";
import { formatTime } from "./utils/time";
import { getFileName } from "./utils/stack";
import { formatData, stripAnsiCodes } from "./utils/format";
import { FileManager } from "./core/file-manager";
import { ColorManager } from "./core/color-manager";
import type { Color } from "./constants/colors";

export class Loggy {
  private readonly options: LogOptions;
  private readonly fileManager?: FileManager;
  private readonly colorManager: ColorManager;

  constructor(options: LogOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.colorManager = new ColorManager(this.options.customColors);

    if (this.options.logToFile) {
      this.fileManager = new FileManager(
        this.options.logDirectory!,
        this.options.maxFileSize!,
        this.options.maxFiles!
      );
    }
  }

  private formatLogMessage(
    level: LogLevel,
    data: unknown,
    color?: Color
  ): string {
    const components = {
      level: this.colorManager.getLevelColor(level),
      timestamp: this.options.showTimestamp ? formatTime(this.options.timeFormat!) : "",
      fileName: this.options.showFileName ? getFileName() : "",
      message: formatData(data, color),
    };

    return this.options.logFormat!
      .replace("{level}", components.level)
      .replace("{timestamp}", components.timestamp)
      .replace("{fileName}", components.fileName)
      .replace("{message}", components.message);
  }

  log<T>(data: T, level: LogLevel = "info", color?: Color): void {
    if (LOG_LEVELS[level] < LOG_LEVELS[this.options.minLogLevel!]) {
      return;
    }

    const logMessage = this.formatLogMessage(level, data, color);
    
    console.log(logMessage);
    
    if (this.fileManager) {
      const cleanMessage = stripAnsiCodes(logMessage);
      this.fileManager.write(cleanMessage);
    }
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
}
