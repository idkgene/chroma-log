import type { LogLevel } from "./options";

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: unknown;
  context?: Record<string, unknown>;
  fileName?: string;
  formattedMessage: string;
}

export interface TransportConfig {
  name: string;
  level?: LogLevel;
  format?: (entry: LogEntry) => string;
  filter?: (entry: LogEntry) => boolean;
}

export interface Transport {
  write(entry: LogEntry): Promise<void> | void;
  end?(): Promise<void> | void;
}
