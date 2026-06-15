# Desafios Kafka

Cada desafio tem uma pasta propria em `labs/kafka/challenges/<id>` com:

- `docker-compose.yml` para subir o ambiente do desafio.
- `README.md` com tarefas e checklist.
- `solution.md` para registrar respostas e evidencias.
- `verify.sh` para validar sinais minimos de conclusao.

## Como usar

```bash
cd labs/kafka/challenges/kafka-single-broker
docker compose up -d
./verify.sh
```

## Lista

| Desafio | Ambiente | Topics verificados | ID |
| --- | --- | --- | --- |
| [Kafka local: producer, consumer e offsets](../../labs/kafka/challenges/kafka-single-broker/README.md) | `single` | `orders.events` | `kafka-single-broker` |
| [Kafka internals: ciclo de vida do record](../../labs/kafka/challenges/kafka-record-lifecycle/README.md) | `cluster` | `record.lifecycle` | `kafka-record-lifecycle` |
| [Producer confiavel: acks, retries e idempotencia](../../labs/kafka/challenges/kafka-producer-reliability/README.md) | `cluster` | `finance.events` | `kafka-producer-reliability` |
| [Consumer offsets: commits, lag e reset](../../labs/kafka/challenges/kafka-consumer-offsets/README.md) | `cluster` | `consumer.offsets.lab` | `kafka-consumer-offsets` |
| [Kafka internals: replication, ISR e leader election](../../labs/kafka/challenges/kafka-internals-cluster/README.md) | `cluster` | `orders.internal` | `kafka-internals-cluster` |
| [KRaft: metadata quorum e controllers](../../labs/kafka/challenges/kafka-kraft-metadata/README.md) | `none` | conceitual | `kafka-kraft-metadata` |
| [Consumer rebalancing: eager, cooperative e static membership](../../labs/kafka/challenges/kafka-rebalance-protocols/README.md) | `cluster` | `rebalance.lab` | `kafka-rebalance-protocols` |
| [Kafka: chave de particionamento e ordenacao](../../labs/kafka/challenges/kafka-partition-key-ordering/README.md) | `cluster` | `order.lifecycle` | `kafka-partition-key-ordering` |
| [Topic design: naming, partitions, RF e ownership](../../labs/kafka/challenges/kafka-topic-design/README.md) | `cluster` | `catalog.orders.v1` | `kafka-topic-design` |
| [Retention e compaction: replay, tombstones e estado](../../labs/kafka/challenges/kafka-retention-compaction/README.md) | `cluster` | `customer.snapshot` | `kafka-retention-compaction` |
| [Schema evolution: contratos de evento e compatibilidade](../../labs/kafka/challenges/kafka-schema-evolution/README.md) | `none` | conceitual | `kafka-schema-evolution` |
| [Transactions e exactly-once semantics](../../labs/kafka/challenges/kafka-transactions-eos/README.md) | `cluster` | `payment.commands`, `payment.events.tx` | `kafka-transactions-eos` |
| [Kafka: DLQ, poison message e idempotencia](../../labs/kafka/challenges/kafka-dlq-idempotency/README.md) | `cluster` | `payment.events`, `payment.retry`, `payment.dlq` | `kafka-dlq-idempotency` |
| [Transactional outbox e CDC](../../labs/kafka/challenges/kafka-outbox-cdc/README.md) | `none` | conceitual | `kafka-outbox-cdc` |
| [Stream processing: state store, joins e changelog](../../labs/kafka/challenges/kafka-stream-processing/README.md) | `none` | conceitual | `kafka-stream-processing` |
| [Performance tuning: batching, compressao e throughput](../../labs/kafka/challenges/kafka-performance-tuning/README.md) | `cluster` | `perf.events` | `kafka-performance-tuning` |
| [Security e quotas: TLS, SASL, ACLs e multi-tenancy](../../labs/kafka/challenges/kafka-security-quotas/README.md) | `none` | conceitual | `kafka-security-quotas` |
| [Observability e incidentes: lag, ISR, capacidade e DR](../../labs/kafka/challenges/kafka-observability-incidents/README.md) | `cluster` | `incident.orders` | `kafka-observability-incidents` |
