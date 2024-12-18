use crate::entry::LogEntry;

pub trait Formatter: Send + Sync {
    fn format(&self, entry: &LogEntry) -> String;
}

pub struct JsonFormatter;

impl Formatter for JsonFormatter {
    fn format(&self, entry: &LogEntry) -> String {
        serde_json::to_string(entry).unwrap_or_else(|_| "Error formatting log entry".to_string())
    }
}

pub struct SimpleFormatter;

impl Formatter for SimpleFormatter {
    fn format(&self, entry: &LogEntry) -> String {
        format!(
            "[{}] {} - {}: {}",
            entry.timestamp.format("%Y-%m-%d %H:%M:%S"),
            entry.level,
            entry.message,
            entry.metadata.as_ref().map_or("".to_string(), |m| serde_json::to_string(m).unwrap_or_default())
        )
    }
}
