import { ChromaLog } from "./chromalog";

const logger = new ChromaLog({
  logToFile: true,
  logDirectory: "./logs",
  maxFileSize: 1024 * 1024, // 1 MB
  maxFiles: 3,
});

logger.info("This is a test log message");
logger.error("This is an error message");
