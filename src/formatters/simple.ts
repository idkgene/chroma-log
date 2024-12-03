import type { Formatter, FormatterOptions } from "../types/formatter";
import type { LogEntry } from "../types/transport";
import { stripAnsiCodes } from "../utils/format";

export class SimpleFormatter implements Formatter {
  private readonly options: FormatterOptions;

  constructor(options: FormatterOptions = {}) {
    this.options = {
      colors: true,
      timestamp: "HH:mm:ss",
      levelPadding: true,
      ...options
    };
  }

  format(entry: LogEntry): string {
    let result = entry.formattedMessage;
    
    if (!this.options.colors) {
      result = stripAnsiCodes(result);
    }
    
    return result;
  }
}
