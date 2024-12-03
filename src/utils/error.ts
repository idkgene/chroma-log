import { stripAnsiCodes } from "./format";

interface ErrorInfo {
  name: string;
  message: string;
  stack?: string | undefined;
  cause?: ErrorInfo | undefined;
  metadata?: Record<string, unknown> | undefined;
}

function extractErrorMetadata(error: Error): Record<string, unknown> {
  const metadata: Record<string, unknown> = {};
  
  for (const key of Object.keys(error)) {
    if (key !== 'name' && key !== 'message' && key !== 'stack' && key !== 'cause') {
      metadata[key] = (error as any)[key];
    }
  }
  
  return metadata;
}

export function formatError(error: Error | unknown): ErrorInfo {
  if (!(error instanceof Error)) {
    return {
      name: 'UnknownError',
      message: String(error),
      metadata: { originalValue: error }
    };
  }

  const errorInfo: ErrorInfo = {
    name: error.name,
    message: error.message
  };

  if (error.stack) {
    errorInfo.stack = error.stack.split('\n').slice(1).map(line => line.trim()).join('\n');
  }

  const metadata = extractErrorMetadata(error);
  if (Object.keys(metadata).length > 0) {
    errorInfo.metadata = metadata;
  }

  if (error.cause) {
    errorInfo.cause = formatError(error.cause);
  }

  return errorInfo;
}

export function serializeError(error: Error | unknown): string {
  const errorInfo = formatError(error);
  return stripAnsiCodes(JSON.stringify(errorInfo, null, 2));
}
