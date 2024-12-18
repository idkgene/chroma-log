use super::Formatter;
use crate::core::LogEntry;

pub struct JsonFormatter;

impl Formatter for JsonFormatter {
    fn format(&self, entry: &LogEntry) -> String {
        serde_json::to_string(entry).unwrap_or_else(|_| "Error formatting log entry".to_string())
    }
}
