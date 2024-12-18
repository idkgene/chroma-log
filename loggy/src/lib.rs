pub mod config;
pub mod core;
pub mod formatter;
pub mod writer;
pub mod plugins;

use std::sync::Arc;
use parking_lot::RwLock;
use anyhow::Result;

pub use crate::core::{Logger, Level, LogEntry};
pub use crate::config::{Config, TomlConfig};
pub use crate::formatter::{Formatter, JsonFormatter, SimpleFormatter};
pub use crate::writer::{Writer, ConsoleWriter, FileWriter};
pub use crate::plugins::{Plugin, StackTracePlugin, SensitiveDataMaskPlugin};

pub struct LoggyBuilder {
    config: Option<Arc<RwLock<dyn Config>>>,
    formatter: Option<Arc<dyn Formatter>>,
    writer: Option<Arc<dyn Writer>>,
    plugins: Vec<Box<dyn Plugin>>,
}

impl LoggyBuilder {
    pub fn new() -> Self {
        Self {
            config: None,
            formatter: None,
            writer: None,
            plugins: Vec::new(),
        }
    }

    pub fn with_config(mut self, config: Arc<RwLock<dyn Config>>) -> Self {
        self.config = Some(config);
        self
    }

    pub fn with_formatter(mut self, formatter: Arc<dyn Formatter>) -> Self {
        self.formatter = Some(formatter);
        self
    }

    pub fn with_writer(mut self, writer: Arc<dyn Writer>) -> Self {
        self.writer = Some(writer);
        self
    }

    pub fn with_plugin(mut self, plugin: Box<dyn Plugin>) -> Self {
        self.plugins.push(plugin);
        self
    }

    pub fn build(self) -> Result<Logger> {
        let config = self.config.unwrap_or_else(|| Arc::new(RwLock::new(TomlConfig::default())));
        let formatter = self.formatter.unwrap_or_else(|| Arc::new(SimpleFormatter));
        let writer = self.writer.unwrap_or_else(|| Arc::new(ConsoleWriter));

        Ok(Logger::new(config, formatter, writer))
    }
}

#[macro_export]
macro_rules! log {
    ($logger:expr, $level:expr, $($arg:tt)+) => {
        $logger.log($level, format!($($arg)+), None, file!().to_string(), line!())
    };
}

#[macro_export]
macro_rules! debug {
    ($logger:expr, $($arg:tt)+) => {
        log!($logger, $crate::Level::Debug, $($arg)+)
    };
}

#[macro_export]
macro_rules! info {
    ($logger:expr, $($arg:tt)+) => {
        log!($logger, $crate::Level::Info, $($arg)+)
    };
}

#[macro_export]
macro_rules! warn {
    ($logger:expr, $($arg:tt)+) => {
        log!($logger, $crate::Level::Warn, $($arg)+)
    };
}

#[macro_export]
macro_rules! error {
    ($logger:expr, $($arg:tt)+) => {
        log!($logger, $crate::Level::Error, $($arg)+)
    };
}
