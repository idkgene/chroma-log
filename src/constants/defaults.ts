export const DEFAULT_OPTIONS = {
  showTimestamp: true,
  showFileName: true,
  timeFormat: "HH:mm:ss",
  logToFile: false,
  logDirectory: "./logs",
  maxFileSize: 10 * 1024 * 1024, // 10 MB
  maxFiles: 5,
  minLogLevel: "debug",
  logFormat: "{level} {timestamp} {fileName} {context} {message}",
  errorFormat: {
    includeStack: true,
    includeCause: true,
    includeMetadata: true
  }
} as const;

export const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
} as const;
