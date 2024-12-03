import type { Formatter, FormatterOptions } from "../types/formatter";
import type { LogEntry } from "../types/transport";
import { stripAnsiCodes } from "../utils/format";

export class JsonFormatter implements Formatter {
  private readonly options: FormatterOptions;

  constructor(options: FormatterOptions = {}) {
    this.options = options;
  }

  format(entry: LogEntry): string {
    const output = {
      timestamp: entry.timestamp.toISOString(),
      level: entry.level,
      message: this.options.colors 
        ? entry.formattedMessage 
        : stripAnsiCodes(entry.formattedMessage),
      context: entry.context,
      fileName: entry.fileName
    };

    return JSON.stringify(output);
  }
}
