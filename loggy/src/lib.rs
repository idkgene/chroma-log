pub mod level;
pub mod entry;
pub mod formatter;
pub mod writer;
pub mod config;

use std::sync::Arc;
use parking_lot::RwLock;
use crossbeam_channel::{unbounded, Sender, Receiver};
use anyhow::Result;

use crate::level::Level;
use crate::entry::LogEntry;
use crate::formatter::Formatter;
use crate::writer::Writer;
use crate::config::Config;

pub struct Logger {
    config: Arc<RwLock<Config>>,
    formatter: Arc<dyn Formatter + Send + Sync>,
    writer: Arc<dyn Writer + Send + Sync>,
    sender: Sender<LogEntry>,
}

impl Logger {
    pub fn new(config: Config, formatter: Arc<dyn Formatter + Send + Sync>, writer: Arc<dyn Writer + Send + Sync>) -> Self {
        let (sender, receiver) = unbounded();
        let logger = Logger {
            config: Arc::new(RwLock::new(config)),
            formatter,
            writer,
            sender,
        };
        logger.start_worker(receiver);
        logger
    }

    fn start_worker(&self, receiver: Receiver<LogEntry>) {
        let config = self.config.clone();
        let formatter = self.formatter.clone();
        let writer = self.writer.clone();
        std::thread::spawn(move || {
            while let Ok(entry) = receiver.recv() {
                let config = config.read();
                if entry.level >= config.min_level {
                    let formatted = formatter.format(&entry);
                    if let Err(e) = writer.write(&formatted) {
                        eprintln!("Failed to write log: {}", e);
                    }
                }
            }
        });
    }

    pub fn log(&self, level: Level, message: String, metadata: Option<serde_json::Value>) -> Result<()> {
        let entry = LogEntry::new(level, message, metadata);
        self.sender.send(entry)?;
        Ok(())
    }

    pub fn debug(&self, message: String, metadata: Option<serde_json::Value>) -> Result<()> {
        self.log(Level::Debug, message, metadata)
    }

    pub fn info(&self, message: String, metadata: Option<serde_json::Value>) -> Result<()> {
        self.log(Level::Info, message, metadata)
    }

    pub fn warn(&self, message: String, metadata: Option<serde_json::Value>) -> Result<()> {
        self.log(Level::Warn, message, metadata)
    }

    pub fn error(&self, message: String, metadata: Option<serde_json::Value>) -> Result<()> {
        self.log(Level::Error, message, metadata)
    }

    pub fn set_min_level(&self, level: Level) {
        self.config.write().min_level = level;
    }

    pub fn get_config(&self) -> Config {
        self.config.read().clone()
    }
}
