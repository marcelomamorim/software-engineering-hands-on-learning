# Apache Kafka

Este modulo foca em Kafka como infraestrutura de dados distribuida, nao apenas como "fila".

## Modelo mental

Kafka e um log distribuido particionado. Producers escrevem registros em topics. Topics sao divididos em partitions. Consumers leem offsets. Consumer groups dividem partitions entre consumidores para paralelizar processamento.

## Topicos profundos

### Fundamentos

- Topic.
- Partition.
- Offset.
- Broker.
- Producer.
- Consumer.
- Consumer group.
- Replication factor.
- Leader, follower e ISR.
- Segmentos de log.
- High watermark.
- Leader epoch.
- Controller.
- Metadata quorum em KRaft.

### Producers

- Acks.
- Retries.
- Idempotent producer.
- Batching.
- Compression.
- Partition key.
- Ordering por partition.

### Consumers

- Offset commit automatico vs manual.
- Consumer lag.
- Rebalance.
- Max poll interval.
- Poison messages.
- Dead letter topics.
- Idempotencia no processamento.

### Operacao

- Retention.
- Compaction.
- Partition count.
- Replication factor.
- Monitoring.
- Schema evolution.
- Backpressure.
- Preferred leader election.
- Under-replicated partitions.
- Consumer group rebalancing.
- Partition reassignment.

### Arquitetura

- Event notification vs event-carried state transfer.
- Event sourcing.
- CQRS com Kafka.
- Outbox pattern.
- Sagas coreografadas.
- Reprocessamento.

## Laboratorios

Antes dos labs, estude a jornada completa de uma mensagem em [message-lifecycle.md](message-lifecycle.md).

Comece em [labs/kafka/README.md](../../labs/kafka/README.md).

Depois faca o laboratorio de funcionamento interno em [labs/kafka/internals.md](../../labs/kafka/internals.md).

## Perguntas que voce deve conseguir responder

- Quando Kafka e uma boa escolha?
- Quando Kafka e uma escolha ruim?
- Por que aumentar partitions pode ajudar throughput, mas piorar ordenacao e operacao?
- O que acontece quando um consumer fica lento?
- Como reprocessar eventos sem duplicar efeitos colaterais?
- Como garantir ordenacao para eventos de um mesmo pedido?
- Qual a diferenca entre retention e compaction?
- O que muda entre commit automatico e manual?
- Como Kafka decide qual broker e leader de uma partition?
- O que e ISR e por que ele importa para durabilidade?
- O que e high watermark?
- Por que Kafka consegue alto throughput com log append-only?
- O que realmente acontece em um rebalance de consumer group?
