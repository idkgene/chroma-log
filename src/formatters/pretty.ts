import type { Formatter, FormatterOptions } from "../types/formatter";
import type { LogEntry } from "../types/transport";
import { formatTime } from "../utils/time";
import { stripAnsiCodes } from "../utils/format";
import { LOG_LEVELS } from "../constants/defaults";

export class PrettyFormatter implements Formatter {
  private readonly options: FormatterOptions;
  private readonly levelPadding: number;

  constructor(options: FormatterOptions = {}) {
    this.options = {
      colors: true,
      timestamp: "HH:mm:ss",
      levelPadding: true,
      ...options
    };

    this.levelPadding = Math.max(...Object.keys(LOG_LEVELS).map(l => l.length));
  }

  format(entry: LogEntry): string {
    let { formattedMessage } = entry;
    
    if (!this.options.colors) {
      formattedMessage = stripAnsiCodes(formattedMessage);
    }

    const timestamp = this.options.timestamp 
      ? formatTime(this.options.timestamp) 
      : entry.timestamp.toISOString();

    const level = this.options.levelPadding
      ? entry.level.toUpperCase().padEnd(this.levelPadding)
      : entry.level.toUpperCase();

    const prefix = `[${timestamp}] [${level}]`;
    const fileName = entry.fileName ? ` [${entry.fileName}]` : '';
    const context = entry.context && Object.keys(entry.context).length 
      ? ` ${JSON.stringify(entry.context)}`
      : '';

    return `${prefix}${fileName}${context} ${formattedMessage}`;
  }
}
