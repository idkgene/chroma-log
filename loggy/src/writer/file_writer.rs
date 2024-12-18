use super::Writer;
use anyhow::Result;
use std::fs::{OpenOptions, File};
use std::io::{Write, BufWriter};
use std::path::Path;
use std::sync::Mutex;

pub struct FileWriter {
    file: Mutex<BufWriter<File>>,
}

impl FileWriter {
    pub fn new<P: AsRef<Path>>(path: P) -> Result<Self> {
        let file = OpenOptions::new()
            .create(true)
            .append(true)
            .open(path)?;
        Ok(Self {
            file: Mutex::new(BufWriter::new(file)),
        })
    }
}

impl Writer for FileWriter {
    fn write(&self, message: &str) -> Result<()> {
        let mut file = self.file.lock().unwrap();
        writeln!(file, "{}", message)?;
        Ok(())
    }

    fn write_batch(&self, messages: &[String]) -> Result<()> {
        let mut file = self.file.lock().unwrap();
        for message in messages {
            writeln!(file, "{}", message)?;
        }
        file.flush()?;
        Ok(())
    }
}
