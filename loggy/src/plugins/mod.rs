use crate::core::LogEntry;

pub trait Plugin: Send + Sync {
    fn process(&self, entry: &mut LogEntry);
}

pub struct StackTracePlugin;

impl Plugin for StackTracePlugin {
    fn process(&self, entry: &mut LogEntry) {
        if entry.level >= crate::core::Level::Error {
            let backtrace = backtrace::Backtrace::new();
            entry.metadata = Some(serde_json::json!({
                "stacktrace": format!("{:?}", backtrace)
            }));
        }
    }
}

pub struct SensitiveDataMaskPlugin {
    patterns: Vec<regex::Regex>,
}

impl SensitiveDataMaskPlugin {
    pub fn new(patterns: Vec<String>) -> Self {
        Self {
            patterns: patterns.into_iter().map(|p| regex::Regex::new(&p).unwrap()).collect(),
        }
    }
}

impl Plugin for SensitiveDataMaskPlugin {
    fn process(&self, entry: &mut LogEntry) {
        let mut message = entry.message.clone();
        for pattern in &self.patterns {
            message = pattern.replace_all(&message, "[REDACTED]").to_string();
        }
        entry.message = message;
    }
}
