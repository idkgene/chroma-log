use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};
use crate::level::Level;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LogEntry {
    pub level: Level,
    pub message: String,
    pub timestamp: DateTime<Utc>,
    pub metadata: Option<serde_json::Value>,
}

impl LogEntry {
    pub fn new(level: Level, message: String, metadata: Option<serde_json::Value>) -> Self {
        Self {
            level,
            message,
            timestamp: Utc::now(),
            metadata,
        }
    }
}
