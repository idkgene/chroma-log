import type { Color } from "../constants/colors";

export type LogLevel = "info" | "warn" | "error" | "debug";

export interface LogOptions {
  showTimestamp?: boolean;
  showFileName?: boolean;
  timeFormat?: string;
  customColors?: Partial<Record<string, Color>>;
  logToFile?: boolean;
  logDirectory?: string;
  maxFileSize?: number;
  maxFiles?: number;
  minLogLevel?: LogLevel;
  logFormat?: string;
}
