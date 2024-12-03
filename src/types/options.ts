import type { Color } from "../constants/colors";
import type { Transport } from './transport';

export type LogLevel = "info" | "warn" | "error" | "debug";

export type LogContext = Record<string, unknown>;

export interface ErrorFormatOptions {
  includeStack?: boolean;
  includeCause?: boolean;
  includeMetadata?: boolean;
}

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
  context?: LogContext;
  errorFormat?: ErrorFormatOptions;
  transports?: Transport[];
}
