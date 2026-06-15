const kafkaSources = {
  docs: {
    overview: "https://kafka.apache.org/documentation/",
    concepts: "https://kafka.apache.org/documentation/#intro_concepts_and_terms",
    design: "https://kafka.apache.org/documentation/#design",
    implementation: "https://kafka.apache.org/documentation/#implementation",
    producer: "https://kafka.apache.org/documentation/#theproducer",
    consumer: "https://kafka.apache.org/documentation/#theconsumer",
    semantics: "https://kafka.apache.org/documentation/#semantics",
    operations: "https://kafka.apache.org/documentation/#operations",
    configuration: "https://kafka.apache.org/documentation/#configuration",
    security: "https://kafka.apache.org/documentation/#security",
    streams: "https://kafka.apache.org/documentation/streams/",
    connect: "https://kafka.apache.org/documentation/#connect",
  },
  kips: {
    eos:
      "https://cwiki.apache.org/confluence/display/KAFKA/KIP-98%2B-%2BExactly%2BOnce%2BDelivery%2Band%2BTransactional%2BMessaging",
    staticMembership:
      "https://cwiki.apache.org/confluence/display/KAFKA/KIP-345%3A%2BIntroduce%2Bstatic%2Bmembership%2Bprotocol%2Bto%2Breduce%2Bconsumer%2Brebalances",
    cooperativeRebalance:
      "https://cwiki.apache.org/confluence/display/KAFKA/KIP-429%3A+Kafka+Consumer+Incremental+Rebalance+Protocol",
    nextGenConsumer: "https://cwiki.apache.org/confluence/x/HhD1D",
    kraft:
      "https://cwiki.apache.org/confluence/display/KAFKA/KIP-500%3A%2BReplace%2BZooKeeper%2Bwith%2Ba%2BSelf-Managed%2BMetadata%2BQuorum",
  },
  articles: {
    transactions: "https://strimzi.io/blog/2023/05/03/kafka-transactions/",
    partitioning:
      "https://newrelic.com/blog/observability/effective-strategies-kafka-topic-partitioning",
    partitionKey: "https://www.confluent.io/learn/kafka-partition-key/",
    highWatermark: "https://blog.2minutestreaming.com/p/kafka-high-watermark-offset",
  },
};

module.exports = { kafkaSources };
