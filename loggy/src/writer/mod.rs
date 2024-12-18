mod console_writer;
mod file_writer;
mod kafka_writer;

pub use console_writer::ConsoleWriter;
pub use file_writer::FileWriter;
#[cfg(feature = "kafka")]
pub use kafka_writer::KafkaWriter;

use anyhow::Result;

pub trait Writer: Send + Sync {
    fn write(&self, message: &str) -> Result<()>;
    fn write_batch(&self, messages: &[String]) -> Result<()> {
        for message in messages {
            self.write(message)?;
        }
        Ok(())
    }
}
