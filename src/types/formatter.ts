import type { LogEntry } from "./transport";

export interface FormatterOptions {
  colors?: boolean;
  timestamp?: string;
  levelPadding?: boolean;
}

export interface Formatter {
  format(entry: LogEntry): string;
}
