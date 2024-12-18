use super::Formatter;
use crate::core::LogEntry;

pub struct SimpleFormatter;

impl Formatter for SimpleFormatter {
    fn format(&self, entry: &LogEntry) -> String {
        format!(
            "[{}] {} - {} - {}:{} - {}: {}",
            entry.timestamp.format("%Y-%m-%d %H:%M:%S"),
            entry.level,
            entry.thread_id,
            entry.file,
            entry.line,
            entry.message,
            entry.metadata.as_ref().map_or("".to_string(), |m| serde_json::to_string(m).unwrap_or_default())
        )
    }
}
