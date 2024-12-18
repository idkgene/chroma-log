#[cfg(feature = "kafka")]
use rdkafka::producer::{FutureProducer, FutureRecord};
#[cfg(feature = "kafka")]
use rdkafka::ClientConfig;

#[cfg(feature = "kafka")]
pub struct KafkaWriter {
    producer: FutureProducer,
    topic: String,
}

#[cfg(feature = "kafka")]
impl KafkaWriter {
    pub fn new(brokers: &str, topic: &str) -> Result<Self> {
        let producer: FutureProducer = ClientConfig::new()
            .set("bootstrap.servers", brokers)
            .set("message.timeout.ms", "5000")
            .create()?;
        
        Ok(Self {
            producer,
            topic: topic.to_string(),
        })
    }
}

#[cfg(feature = "kafka")]
impl Writer for KafkaWriter {
    fn write(&self, message: &str) -> Result<()> {
        let record = FutureRecord::to(&self.topic)
            .payload(message)
            .key("");
        
        self.producer.send(record, std::time::Duration::from_secs(0)).map(|_| ())?;
        Ok(())
    }

    fn write_batch(&self, messages: &[String]) -> Result<()> {
        for message in messages {
            self.write(message)?;
        }
        Ok(())
    }
}
