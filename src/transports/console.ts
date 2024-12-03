import type { Transport, TransportConfig, LogEntry } from "../types/transport";
import { LOG_LEVELS } from "../constants/defaults";

export class ConsoleTransport implements Transport {
  private readonly config: TransportConfig;

  constructor(config: Partial<TransportConfig> = {}) {
    this.config = {
      name: 'console',
      ...config
    };
  }

  write(entry: LogEntry): void {
    if (this.config.level && LOG_LEVELS[entry.level] < LOG_LEVELS[this.config.level]) {
      return;
    }

    if (this.config.filter && !this.config.filter(entry)) {
      return;
    }

    const message = this.config.format ? this.config.format(entry) : entry.formattedMessage;
    console.log(message);
  }
}
