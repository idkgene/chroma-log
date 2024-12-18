use std::fs::{OpenOptions, File};
use std::io::{Write, BufWriter};
use std::path::Path;
use anyhow::Result;

pub trait Writer: Send + Sync {
    fn write(&self, message: &str) -> Result<()>;
}

pub struct ConsoleWriter;

impl Writer for ConsoleWriter {
    fn write(&self, message: &str) -> Result<()> {
        println!("{}", message);
        Ok(())
    }
}

pub struct FileWriter {
    file: BufWriter<File>,
}

impl FileWriter {
    pub fn new<P: AsRef<Path>>(path: P) -> Result<Self> {
        let file = OpenOptions::new()
            .create(true)
            .append(true)
            .open(path)?;
        Ok(Self {
            file: BufWriter::new(file),
        })
    }
}

impl Writer for FileWriter {
    fn write(&self, message: &str) -> Result<()> {
        writeln!(self.file.get_ref(), "{}", message)?;
        Ok(())
    }
}

pub struct MultiWriter {
    writers: Vec<Box<dyn Writer>>,
}

impl MultiWriter {
    pub fn new(writers: Vec<Box<dyn Writer>>) -> Self {
        Self { writers }
    }
}

impl Writer for MultiWriter {
    fn write(&self, message: &str) -> Result<()> {
        for writer in &self.writers {
            writer.write(message)?;
        }
        Ok(())
    }
}
