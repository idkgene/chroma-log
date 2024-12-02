import fs from "fs";
import path from "path";

export class FileManager {
  private currentLogFile: string | null = null;
  private currentFileSize: number = 0;
  private readonly logDirectory: string;
  private readonly maxFileSize: number;
  private readonly maxFiles: number;

  constructor(logDirectory: string, maxFileSize: number, maxFiles: number) {
    this.logDirectory = logDirectory;
    this.maxFileSize = maxFileSize;
    this.maxFiles = maxFiles;
    this.ensureLogDirectory();
    this.rotateLogFiles();
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory, { recursive: true });
    }
  }

  private rotateLogFiles(): void {
    const files = fs.readdirSync(this.logDirectory)
      .filter(file => file.startsWith("log_"))
      .sort((a, b) => b.localeCompare(a));

    if (files.length >= this.maxFiles) {
      const filesToRemove = files.slice(this.maxFiles - 1);
      for (const file of filesToRemove) {
        fs.unlinkSync(path.join(this.logDirectory, file));
      }
    }

    this.currentLogFile = path.join(
      this.logDirectory,
      `log_${Date.now()}.log`
    );
    this.currentFileSize = 0;
  }

  write(message: string): void {
    if (!this.currentLogFile) return;

    const messageWithNewline = message + "\n";
    const messageSize = Buffer.byteLength(messageWithNewline);

    if (this.currentFileSize + messageSize > this.maxFileSize) {
      this.rotateLogFiles();
    }

    fs.appendFileSync(this.currentLogFile, messageWithNewline);
    this.currentFileSize += messageSize;
  }
}
