import type { Transport, TransportConfig, LogEntry } from "../types/transport";
import { LOG_LEVELS } from "../constants/defaults";

export interface HttpTransportConfig extends TransportConfig {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  batchSize?: number;
  batchTimeout?: number;
}

export class HttpTransport implements Transport {
  private readonly config: HttpTransportConfig;
  private batch: LogEntry[] = [];
  private timeout: NodeJS.Timeout | null = null;

  constructor(config: HttpTransportConfig) {
    this.config = {
      method: 'POST',
      batchSize: 10,
      batchTimeout: 5000,
      ...config,
      name: config.name ?? 'http'
    };
  }

  private async sendBatch(entries: LogEntry[]): Promise<void> {
    if (entries.length === 0) return;

    try {
      const response = await fetch(this.config.url, {
        method: this.config.method ?? 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.headers ?? {})
        },
        body: JSON.stringify(entries)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to send logs:', error);
    }
  }

  private scheduleSend(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      const entries = [...this.batch];
      this.batch = [];
      this.sendBatch(entries);
    }, this.config.batchTimeout);
  }

  write(entry: LogEntry): void {
    if (this.config.level && LOG_LEVELS[entry.level] < LOG_LEVELS[this.config.level]) {
      return;
    }

    if (this.config.filter && !this.config.filter(entry)) {
      return;
    }

    this.batch.push(entry);

    if (this.batch.length >= (this.config.batchSize ?? 1)) {
      const entries = [...this.batch];
      this.batch = [];
      this.sendBatch(entries);
    } else {
      this.scheduleSend();
    }
  }

  async end(): Promise<void> {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    await this.sendBatch(this.batch);
    this.batch = [];
  }
}
