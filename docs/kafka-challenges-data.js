window.KAFKA_CHALLENGES_DATA = [
  {
    "id": "kafka-single-broker",
    "title": "Kafka local: producer, consumer e offsets",
    "summary": "Suba um broker local, rode producer/consumer em Python e observe offsets, keys, commits manuais e reprocessamento.",
    "duration": "60-90 min",
    "environment": "single",
    "topics": [
      "orders.events"
    ],
    "labReadme": "./labs/kafka/challenges/kafka-single-broker/"
  },
  {
    "id": "kafka-record-lifecycle",
    "title": "Kafka internals: ciclo de vida do record",
    "summary": "Siga um record desde o producer ate os arquivos de log, segmentos, indices e page cache.",
    "duration": "2-3 h",
    "environment": "cluster",
    "topics": [
      "record.lifecycle"
    ],
    "labReadme": "./labs/kafka/challenges/kafka-record-lifecycle/"
  },
  {
    "id": "kafka-producer-reliability",
    "title": "Producer confiavel: acks, retries e idempotencia",
    "summary": "Configure producer para durabilidade com acks=all, retries, idempotencia e ordenacao controlada.",
    "duration": "2-3 h",
    "environment": "cluster",
    "topics": [
      "finance.events"
    ],
    "labReadme": "./labs/kafka/challenges/kafka-producer-reliability/"
  },
  {
    "id": "kafka-consumer-offsets",
    "title": "Consumer offsets: commits, lag e reset",
    "summary": "Explore commit manual, consumer lag, reset de offsets e reprocessamento seguro.",
    "duration": "2-3 h",
    "environment": "cluster",
    "topics": [
      "consumer.offsets.lab"
    ],
    "labReadme": "./labs/kafka/challenges/kafka-consumer-offsets/"
  },
  {
    "id": "kafka-internals-cluster",
    "title": "Kafka internals: replication, ISR e leader election",
    "summary": "Use um cluster com 3 brokers para observar leaders, replicas, ISR, falha de broker, high watermark e rebalance.",
    "duration": "2-4 h",
    "environment": "cluster",
    "topics": [
      "orders.internal"
    ],
    "labReadme": "./labs/kafka/challenges/kafka-internals-cluster/"
  },
  {
    "id": "kafka-kraft-metadata",
    "title": "KRaft: metadata quorum e controllers",
    "summary": "Estude como Kafka moderno gerencia metadata com KRaft, controller quorum e metadata log.",
    "duration": "2-3 h",
    "environment": "none",
    "topics": [],
    "labReadme": "./labs/kafka/challenges/kafka-kraft-metadata/"
  },
  {
    "id": "kafka-rebalance-protocols",
    "title": "Consumer rebalancing: eager, cooperative e static membership",
    "summary": "Entenda protocolos de rebalance, pausas de processamento e como reduzir churn em consumer groups.",
    "duration": "2-4 h",
    "environment": "cluster",
    "topics": [
      "rebalance.lab"
    ],
    "labReadme": "./labs/kafka/challenges/kafka-rebalance-protocols/"
  },
  {
    "id": "kafka-partition-key-ordering",
    "title": "Kafka: chave de particionamento e ordenacao",
    "summary": "Projete a partition key para manter ordem por pedido sem criar hot partitions.",
    "duration": "90-120 min",
    "environment": "cluster",
    "topics": [
      "order.lifecycle"
    ],
    "labReadme": "./labs/kafka/challenges/kafka-partition-key-ordering/"
  },
  {
    "id": "kafka-topic-design",
    "title": "Topic design: naming, partitions, RF e ownership",
    "summary": "Desenhe topicos como contratos operacionais: nome, dono, retention, partitions, replication factor e SLO.",
    "duration": "2-3 h",
    "environment": "cluster",
    "topics": [
      "catalog.orders.v1"
    ],
    "labReadme": "./labs/kafka/challenges/kafka-topic-design/"
  },
  {
    "id": "kafka-retention-compaction",
    "title": "Retention e compaction: replay, tombstones e estado",
    "summary": "Compare delete retention e log compaction, incluindo tombstones, changelog topics e recuperacao de estado.",
    "duration": "2-4 h",
    "environment": "cluster",
    "topics": [
      "customer.snapshot"
    ],
    "labReadme": "./labs/kafka/challenges/kafka-retention-compaction/"
  },
  {
    "id": "kafka-schema-evolution",
    "title": "Schema evolution: contratos de evento e compatibilidade",
    "summary": "Modele contratos de evento que evoluem sem quebrar consumidores independentes.",
    "duration": "2-3 h",
    "environment": "none",
    "topics": [],
    "labReadme": "./labs/kafka/challenges/kafka-schema-evolution/"
  },
  {
    "id": "kafka-transactions-eos",
    "title": "Transactions e exactly-once semantics",
    "summary": "Estude idempotent producer, transactions, isolation.level=read_committed e os limites do exactly-once.",
    "duration": "3-5 h",
    "environment": "cluster",
    "topics": [
      "payment.commands",
      "payment.events.tx"
    ],
    "labReadme": "./labs/kafka/challenges/kafka-transactions-eos/"
  },
  {
    "id": "kafka-dlq-idempotency",
    "title": "Kafka: DLQ, poison message e idempotencia",
    "summary": "Desenhe o comportamento de consumidores diante de mensagens invalidas, retries e efeitos colaterais duplicados.",
    "duration": "2-3 h",
    "environment": "cluster",
    "topics": [
      "payment.events",
      "payment.retry",
      "payment.dlq"
    ],
    "labReadme": "./labs/kafka/challenges/kafka-dlq-idempotency/"
  },
  {
    "id": "kafka-outbox-cdc",
    "title": "Transactional outbox e CDC",
    "summary": "Evite dual write entre banco e Kafka usando outbox transacional e publicacao via CDC ou publisher confiavel.",
    "duration": "3-5 h",
    "environment": "none",
    "topics": [],
    "labReadme": "./labs/kafka/challenges/kafka-outbox-cdc/"
  },
  {
    "id": "kafka-stream-processing",
    "title": "Stream processing: state store, joins e changelog",
    "summary": "Projete uma topologia de processamento com agregacoes, state store, joins e changelog topics.",
    "duration": "3-5 h",
    "environment": "none",
    "topics": [],
    "labReadme": "./labs/kafka/challenges/kafka-stream-processing/"
  },
  {
    "id": "kafka-performance-tuning",
    "title": "Performance tuning: batching, compressao e throughput",
    "summary": "Ajuste producer e consumer para comparar throughput, latencia, compressao, batch e fetch.",
    "duration": "3-5 h",
    "environment": "cluster",
    "topics": [
      "perf.events"
    ],
    "labReadme": "./labs/kafka/challenges/kafka-performance-tuning/"
  },
  {
    "id": "kafka-security-quotas",
    "title": "Security e quotas: TLS, SASL, ACLs e multi-tenancy",
    "summary": "Projete acesso seguro para produtores e consumidores com autenticacao, autorizacao e limites por cliente.",
    "duration": "2-4 h",
    "environment": "none",
    "topics": [],
    "labReadme": "./labs/kafka/challenges/kafka-security-quotas/"
  },
  {
    "id": "kafka-observability-incidents",
    "title": "Observability e incidentes: lag, ISR, capacidade e DR",
    "summary": "Monte um runbook de producao para lag, under-replicated partitions, broker saturado e recuperacao de desastre.",
    "duration": "4-6 h",
    "environment": "cluster",
    "topics": [
      "incident.orders"
    ],
    "labReadme": "./labs/kafka/challenges/kafka-observability-incidents/"
  }
];
