import fs from 'fs/promises';
import path from 'path';
import type { Transport, TransportConfig, LogEntry } from "../types/transport";
import { LOG_LEVELS } from "../constants/defaults";
import { stripAnsiCodes } from "../utils/format";

export interface FileTransportConfig extends TransportConfig {
  filename: string;
  maxSize?: number;
  maxFiles?: number;
}

export class FileTransport implements Transport {
  private readonly config: FileTransportConfig;
  private currentSize: number = 0;
  private writePromise: Promise<void> = Promise.resolve();

  constructor(config: FileTransportConfig) {
    this.config = {
      maxSize: 10 * 1024 * 1024, // 10 MB
      maxFiles: 5,
      ...config,
      name: config.name ?? 'file'
    };
    
    const dir = path.dirname(this.config.filename);
    fs.mkdir(dir, { recursive: true }).catch(() => {});
  }

  private async rotate(): Promise<void> {
    const dir = path.dirname(this.config.filename);
    const base = path.basename(this.config.filename);
    const files = await fs.readdir(dir);
    
    const rotatedFiles = files
      .filter(f => f.startsWith(base))
      .sort((a, b) => b.localeCompare(a));

    while (rotatedFiles.length >= (this.config.maxFiles ?? 1)) {
      const file = rotatedFiles.pop();
      if (file) {
        await fs.unlink(path.join(dir, file)).catch(() => {});
      }
    }

    if (await fs.stat(this.config.filename).catch(() => null)) {
      const newName = `${this.config.filename}.${Date.now()}`;
      await fs.rename(this.config.filename, newName).catch(() => {});
    }

    this.currentSize = 0;
  }

  async write(entry: LogEntry): Promise<void> {
    if (this.config.level && LOG_LEVELS[entry.level] < LOG_LEVELS[this.config.level]) {
      return;
    }

    if (this.config.filter && !this.config.filter(entry)) {
      return;
    }

    const message = this.config.format 
      ? this.config.format(entry) 
      : stripAnsiCodes(entry.formattedMessage);

    const data = message + '\n';
    const size = Buffer.byteLength(data);

    if (this.currentSize + size > (this.config.maxSize ?? 0)) {
      this.writePromise = this.writePromise
        .then(() => this.rotate())
        .catch(() => {});
    }

    this.writePromise = this.writePromise
      .then(() => fs.appendFile(this.config.filename, data))
      .then(() => {
        this.currentSize += size;
      })
      .catch(() => {});

    return this.writePromise;
  }

  async end(): Promise<void> {
    await this.writePromise;
  }
}
