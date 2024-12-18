use super::Level;
use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};
use std::thread;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LogEntry {
    pub level: Level,
    pub message: String,
    pub timestamp: DateTime<Utc>,
    pub metadata: Option<serde_json::Value>,
    pub thread_id: String,
    pub file: String,
    pub line: u32,
}

impl LogEntry {
    pub fn new(level: Level, message: String, metadata: Option<serde_json::Value>, file: String, line: u32) -> Self {
        Self {
            level,
            message,
            timestamp: Utc::now(),
            metadata,
            thread_id: format!("{:?}", thread::current().id()),
            file,
            line,
        }
    }
}
