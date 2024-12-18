use super::Writer;
use anyhow::Result;
use colored::Colorize;

pub struct ConsoleWriter;

impl Writer for ConsoleWriter {
    fn write(&self, message: &str) -> Result<()> {
        if message.contains("ERROR") {
            println!("{}", message.red());
        } else if message.contains("WARN") {
            println!("{}", message.yellow());
        } else if message.contains("INFO") {
            println!("{}", message.green());
        } else {
            println!("{}", message);
        }
        Ok(())
    }
}
