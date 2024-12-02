<h3 align="center">🚀 Loggy </h3>


<samp align="center">📝 Straightforward minimal logger - like Pino (I REALLY like it), but even more lightweight (at least I try to)</samp>

## 📦 Installation

```bash
WIP
```

## 🚀 Quick Start

```typescript
import { Logger } from 'loggy';

// Create a basic logger
const logger = new Logger();

// Log some messages
logger.info('Server started');
logger.warn({ status: 'degraded', service: 'database' });
logger.error(new Error('Connection failed'));

// With custom colors
logger.info('Success!', 'green');
```

## ⚙️ Configuration

```typescript
const logger = new Logger({
  // Show timestamp in logs
  showTimestamp: true,
  
  // Show filename where log was called
  showFileName: true,
  
  // Custom timestamp format
  timeFormat: 'HH:mm:ss',
  
  // Custom colors for different log levels
  customColors: {
    info: 'cyan',
    warn: 'yellow',
    error: 'red',
    debug: 'magenta'
  },
  
  // File logging options
  logToFile: true,
  logDirectory: './logs',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 5,
  
  // Minimum log level to output
  minLogLevel: 'debug',
  
  // Custom log format
  logFormat: '{level} {timestamp} {fileName} {message}'
});
```
