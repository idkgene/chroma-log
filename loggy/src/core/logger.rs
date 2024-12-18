macro_rules! log_level {
    ($name:ident, $level:expr) => {
        pub fn $name(&self, message: String, metadata: Option<serde_json::Value>) -> Result<()> {
            self.log($level, message, metadata, file!().to_string(), line!())
        }
    };
}

use super::{Level, LogEntry};
use crate::config::Config;
use crate::formatter::Formatter;
use crate::writer::Writer;
use crossbeam_channel::{bounded, Sender, Receiver};
use parking_lot::RwLock;
use std::sync::Arc;
use anyhow::Result;

pub struct Logger {
    config: Arc<RwLock<dyn Config>>,
    formatter: Arc<dyn Formatter>,
    writer: Arc<dyn Writer>,
    sender: Sender<LogEntry>,
}

impl Logger {
    pub fn new(
        config: Arc<RwLock<dyn Config>>,
        formatter: Arc<dyn Formatter>,
        writer: Arc<dyn Writer>,
    ) -> Self {
        let (sender, receiver) = bounded(1000);
        let logger = Logger {
            config,
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
            let mut batch = Vec::new();
            let mut last_flush = std::time::Instant::now();

            loop {
                let timeout = config.read().flush_interval();
                match receiver.recv_timeout(timeout) {
                    Ok(entry) => {
                        batch.push(entry);
                        if batch.len() >= config.read().batch_size() {
                            Self::flush_batch(&mut batch, &formatter, &writer);
                            last_flush = std::time::Instant::now();
                        }
                    }
                    Err(crossbeam_channel::RecvTimeoutError::Timeout) => {
                        if !batch.is_empty() || last_flush.elapsed() >= timeout {
                            Self::flush_batch(&mut batch, &formatter, &writer);
                            last_flush = std::time::Instant::now();
                        }
                    }
                    Err(crossbeam_channel::RecvTimeoutError::Disconnected) => break,
                }
            }
        });
    }

    fn flush_batch(
        batch: &mut Vec<LogEntry>,
        formatter: &Arc<dyn Formatter>,
        writer: &Arc<dyn Writer>,
    ) {
        let formatted: Vec<String> = batch
            .drain(..)
            .map(|entry| formatter.format(&entry))
            .collect();
        if let Err(e) = writer.write_batch(&formatted) {
            eprintln!("Failed to write log batch: {}", e);
        }
    }

    pub fn log(&self, level: Level, message: String, metadata: Option<serde_json::Value>, file: String, line: u32) -> Result<()> {
        let entry = LogEntry::new(level, message, metadata, file, line);
        self.sender.send(entry)?;
        Ok(())
    }

    
    log_level!(debug, Level::Debug);
    log_level!(info, Level::Info);
    log_level!(warn, Level::Warn);
    log_level!(error, Level::Error);
    
    pub fn update_config(&self, new_config: Arc<RwLock<dyn Config>>) {
        let mut current_config = self.config.write();
        let new_config_read = new_config.read();
        
        current_config.set_min_level(new_config_read.min_level());
        current_config.set_max_history(new_config_read.max_history());
        current_config.set_batch_size(new_config_read.batch_size());
        current_config.set_flush_interval(new_config_read.flush_interval());
    }
}
