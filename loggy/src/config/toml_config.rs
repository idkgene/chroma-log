use super::Config;
use crate::core::Level;
use serde::Deserialize;
use std::fs;
use std::path::Path;
use std::sync::Arc;
use parking_lot::RwLock;
use std::time::Duration;

#[derive(Debug, Deserialize, Clone)]
pub struct TomlConfig {
    min_level: Level,
    max_history: usize,
    batch_size: usize,
    flush_interval: u64,
}

impl TomlConfig {
    pub fn from_file<P: AsRef<Path>>(path: P) -> anyhow::Result<Arc<RwLock<Self>>> {
        let content = fs::read_to_string(path)?;
        let config: Self = toml::from_str(&content)?;
        Ok(Arc::new(RwLock::new(config)))
    }
}

impl Config for TomlConfig {
    fn min_level(&self) -> Level {
        self.min_level
    }

    fn set_min_level(&mut self, level: Level) {
        self.min_level = level;
    }

    fn max_history(&self) -> usize {
        self.max_history
    }

    fn set_max_history(&mut self, max_history: usize) {
        self.max_history = max_history;
    }

    fn batch_size(&self) -> usize {
        self.batch_size
    }

    fn set_batch_size(&mut self, batch_size: usize) {
        self.batch_size = batch_size;
    }

    fn flush_interval(&self) -> Duration {
        Duration::from_millis(self.flush_interval)
    }

    fn set_flush_interval(&mut self, interval: Duration) {
        self.flush_interval = interval.as_millis() as u64;
    }
}

impl Default for TomlConfig {
    fn default() -> Self {
        Self {
            min_level: Level::Info,
            max_history: 1000,
            batch_size: 100,
            flush_interval: 5000,
        }
    }
}
