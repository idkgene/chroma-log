# Loggy

Loggy is a high-performance, extensible logging library for Rust.

## Features

- Asynchronous logging
- Support for various output formats
- Customizable logging levels
- Plugin support
- Configuration via TOML

## Installation

Add the following line to your Cargo.toml:

```toml
[dependencies]
loggy = “0.1.0”
```

## Usage

```rs
use loggy::{Logger, LoggyBuilder, SimpleFormatter, ConsoleWriter};

fn main() {
    let logger = LoggyBuilder::new()
        .with_formatter(Arc::new(SimpleFormatter))
        .with_writer(Arc::new(ConsoleWriter))
        .build()
        .unwrap();

    info!(logger, “Hello, world!”);
}
```
