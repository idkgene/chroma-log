mod toml_config;

pub use toml_config::TomlConfig;

use crate::core::Level;

pub trait Config: Send + Sync {
    fn min_level(&self) -> Level;
    fn set_min_level(&mut self, level: Level);
    
    fn max_history(&self) -> usize;
    fn set_max_history(&mut self, max_history: usize);
    
    fn batch_size(&self) -> usize;
    fn set_batch_size(&mut self, batch_size: usize);
    
    fn flush_interval(&self) -> std::time::Duration;
    fn set_flush_interval(&mut self, interval: std::time::Duration);
    // wip
}
