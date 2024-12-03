import { DEFAULT_OPTIONS, LOG_LEVELS } from "./constants/defaults";
import type { LogLevel, LogOptions, LogContext } from "./types/options";
import type { LogEntry, Transport } from "./types/transport";
import { formatTime } from "./utils/time";
import { getFileName } from "./utils/stack";
import { formatData, stripAnsiCodes } from "./utils/format";
import { formatError } from "./utils/error";
import { FileManager } from "./core/file-manager";
import { ColorManager } from "./core/color-manager";
import type { Color } from "./constants/colors";

export class Loggy {
  private readonly options: LogOptions;
  private readonly fileManager?: FileManager;
  private readonly colorManager: ColorManager;
  private readonly context: LogContext;
  private readonly transports: Transport[];

  constructor(options: LogOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.colorManager = new ColorManager(this.options.customColors);
    this.context = options.context || {};
    this.transports = options.transports || [];

    if (this.options.logToFile) {
      this.fileManager = new FileManager(
        this.options.logDirectory!,
        this.options.maxFileSize!,
        this.options.maxFiles!
      );
    }
  }

  child(context: LogContext): Loggy {
    return new Loggy({
      ...this.options,
      context: { ...this.context, ...context }
    });
  }

  private formatLogMessage(
    level: LogLevel,
    data: unknown,
    color?: Color
  ): string {
    let formattedData: string;
    
    if (data instanceof Error) {
      const errorInfo = formatError(data);
      const { errorFormat } = this.options;
      
      if (!errorFormat?.includeStack) {
        delete errorInfo.stack;
      }
      if (!errorFormat?.includeCause) {
        delete errorInfo.cause;
      }
      if (!errorFormat?.includeMetadata) {
        delete errorInfo.metadata;
      }
      
      formattedData = formatData(errorInfo, color);
    } else {
      formattedData = formatData(data, color);
    }

    const components = {
      level: this.colorManager.getLevelColor(level),
      timestamp: this.options.showTimestamp ? formatTime(this.options.timeFormat!) : "",
      fileName: this.options.showFileName ? getFileName() : "",
      message: formattedData,
      context: Object.keys(this.context).length ? formatData(this.context) : ""
    };

    return this.options.logFormat!
      .replace("{level}", components.level)
      .replace("{timestamp}", components.timestamp)
      .replace("{fileName}", components.fileName)
      .replace("{message}", components.message)
      .replace("{context}", components.context);
  }

  async log<T>(data: T, level: LogLevel = "info", color?: Color): Promise<void> {
    if (LOG_LEVELS[level] < LOG_LEVELS[this.options.minLogLevel!]) {
      return;
    }

    const formattedMessage = this.formatLogMessage(level, data, color);
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message: data,
      context: this.context,
      fileName: getFileName(),
      formattedMessage
    };

    const promises = this.transports.map(transport => 
      Promise.resolve(transport.write(entry)).catch(error => 
        console.error(`Transport ${transport.constructor.name} failed:`, error)
      )
    );

    if (this.transports.length === 0) {
      console.log(formattedMessage);
    }
    
    if (this.fileManager) {
      const cleanMessage = stripAnsiCodes(formattedMessage);
      this.fileManager.write(cleanMessage);
    }

    await Promise.all(promises);
  }

  info<T>(data: T, color?: Color): Promise<void> {
    return this.log(data, "info", color);
  }

  warn<T>(data: T, color?: Color): Promise<void> {
    return this.log(data, "warn", color);
  }

  error<T>(data: T, color?: Color): Promise<void> {
    return this.log(data, "error", color);
  }

  debug<T>(data: T, color?: Color): Promise<void> {
    return this.log(data, "debug", color);
  }

  async end(): Promise<void> {
    const promises = this.transports
      .filter(t => t.end)
      .map(t => t.end!());
    await Promise.all(promises);
  }
}
