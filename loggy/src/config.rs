use serde::{Serialize, Deserialize};
use crate::level::Level;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Config {
    pub min_level: Level,
    pub max_history: usize,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            min_level: Level::Info,
            max_history: 1000,
        }
    }
}
