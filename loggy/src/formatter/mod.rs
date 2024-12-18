mod json_formatter;
mod simple_formatter;

pub use json_formatter::JsonFormatter;
pub use simple_formatter::SimpleFormatter;

use crate::core::LogEntry;

pub trait Formatter: Send + Sync {
    fn format(&self, entry: &LogEntry) -> String;
}
