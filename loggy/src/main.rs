use loggy::{Logger, level::Level, config::Config};
use loggy::formatter::SimpleFormatter;
use loggy::writer::{ConsoleWriter, FileWriter, MultiWriter};
use std::sync::Arc;

fn main() -> anyhow::Result<()> {
    let config = Config {
        min_level: Level::Debug,
        max_history: 1000,
    };

    let formatter = Arc::new(SimpleFormatter);
    
    let console_writer = Box::new(ConsoleWriter);
    let file_writer = Box::new(FileWriter::new("app.log")?);
    let writer = Arc::new(MultiWriter::new(vec![console_writer, file_writer]));

    let logger = Logger::new(config, formatter, writer);

    logger.debug("This is a debug message".to_string(), None)?;
    logger.info("Application started".to_string(), None)?;

    let metadata = serde_json::json!({
        "user_id": 123,
        "action": "login",
        "ip": "192.168.1.1"
    });
    logger.info("User logged in".to_string(), Some(metadata))?;

    logger.warn("High memory usage detected".to_string(), None)?;

    let error_metadata = serde_json::json!({
        "error_code": 500,
        "stack_trace": "..."
    });
    logger.error("Database connection failed".to_string(), Some(error_metadata))?;

    logger.set_min_level(Level::Warn);

    logger.info("This message won't be logged".to_string(), None)?;
    logger.warn("But this warning will be".to_string(), None)?;

    Ok(())
}
