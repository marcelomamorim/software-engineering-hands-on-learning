# Kafka Internals Lab

Este laboratorio e para estudar Kafka por dentro. O objetivo e observar o que acontece com logs, partitions, replication, offsets, consumer groups e falhas.

## Subir cluster

```bash
docker compose -f docker-compose.cluster.yml up -d
```

Bootstrap externo:

```text
localhost:19092,localhost:29092,localhost:39092
```

Nos comandos dentro dos containers, use:

```text
kafka-1:9092,kafka-2:9092,kafka-3:9092
```

## 1. Metadata e brokers

Liste os brokers e a configuracao do cluster:

```bash
docker exec -it learning-kafka-1 /opt/kafka/bin/kafka-broker-api-versions.sh --bootstrap-server kafka-1:9092
```

Perguntas:

- Quais brokers aparecem?
- O client precisa conhecer todos os brokers antes de conectar?
- O que o bootstrap server realmente faz?

## 2. Criar topic particionado e replicado

```bash
docker exec -it learning-kafka-1 /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server kafka-1:9092 \
  --create \
  --topic orders.internal \
  --partitions 6 \
  --replication-factor 3
```

Descreva o topic:

```bash
docker exec -it learning-kafka-1 /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server kafka-1:9092 \
  --describe \
  --topic orders.internal
```

Observe:

- Leader.
- Replicas.
- ISR.

Perguntas:

- Por que cada partition tem exatamente um leader?
- O que significa uma replica estar no ISR?
- Como replication factor afeta durabilidade?
- Como partition count afeta paralelismo?

## 3. Log append-only

Produza mensagens com key:

```bash
docker exec -it learning-kafka-1 /opt/kafka/bin/kafka-console-producer.sh \
  --bootstrap-server kafka-1:9092 \
  --topic orders.internal \
  --property parse.key=true \
  --property key.separator=:
```

Digite algumas linhas:

```text
order-1:created
order-1:paid
order-2:created
order-2:paid
```

Consuma do inicio:

```bash
docker exec -it learning-kafka-2 /opt/kafka/bin/kafka-console-consumer.sh \
  --bootstrap-server kafka-2:9092 \
  --topic orders.internal \
  --from-beginning \
  --property print.key=true \
  --property print.partition=true \
  --property print.offset=true \
  --max-messages 4
```

Perguntas:

- Eventos com a mesma key cairam na mesma partition?
- A ordenacao e global ou por partition?
- Offset identifica posicao global no topic ou posicao dentro da partition?

## 4. Inspecionar arquivos de log

Entre no broker que lidera uma partition e liste os dados:

```bash
docker exec -it learning-kafka-1 bash
ls -lah /tmp/kraft-combined-logs
find /tmp/kraft-combined-logs -maxdepth 2 -type f | sort | head -50
```

Procure arquivos como:

```text
00000000000000000000.log
00000000000000000000.index
00000000000000000000.timeindex
```

Perguntas:

- Por que Kafka escreve em segmentos?
- Qual o papel do arquivo `.index`?
- Como append-only ajuda throughput?
- Por que page cache do sistema operacional importa?

## 5. High watermark e leitura segura

Produza mais mensagens e descreva o topic novamente:

```bash
docker exec -it learning-kafka-1 /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server kafka-1:9092 \
  --describe \
  --topic orders.internal
```

Conceitos:

- O leader recebe writes.
- Followers replicam do leader.
- Mensagens so ficam visiveis ao consumidor quando sao consideradas replicadas conforme as garantias do cluster.
- High watermark representa ate onde os registros foram replicados com seguranca para leitura.

Perguntas:

- O que aconteceria se consumers lessem mensagens que ainda nao foram replicadas?
- Como `acks=all` conversa com ISR?
- Qual o risco de `acks=1`?

## 6. Falha de broker e leader election

Pare um broker:

```bash
docker stop learning-kafka-2
```

Descreva o topic:

```bash
docker exec -it learning-kafka-1 /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server kafka-1:9092 \
  --describe \
  --topic orders.internal
```

Observe mudancas em:

- Leader.
- Replicas.
- ISR.

Suba o broker novamente:

```bash
docker start learning-kafka-2
```

Perguntas:

- Quais partitions trocaram de leader?
- O broker que voltou entra imediatamente no ISR?
- O que significa under-replicated partition?
- Que metricas deveriam alertar esse incidente?

## 7. Consumer groups e rebalance

Crie um consumer group:

```bash
docker exec -it learning-kafka-1 /opt/kafka/bin/kafka-console-consumer.sh \
  --bootstrap-server kafka-1:9092 \
  --topic orders.internal \
  --group orders-debug
```

Em outro terminal, rode outro consumer com o mesmo group:

```bash
docker exec -it learning-kafka-2 /opt/kafka/bin/kafka-console-consumer.sh \
  --bootstrap-server kafka-2:9092 \
  --topic orders.internal \
  --group orders-debug
```

Descreva o grupo:

```bash
docker exec -it learning-kafka-3 /opt/kafka/bin/kafka-consumer-groups.sh \
  --bootstrap-server kafka-3:9092 \
  --describe \
  --group orders-debug
```

Perguntas:

- Quantas partitions cada consumer recebeu?
- O que acontece quando um terceiro consumer entra?
- O que acontece se houver mais consumers do que partitions?
- Por que rebalance pode pausar processamento?

## 8. Offset commit e reprocessamento

Veja offsets do grupo:

```bash
docker exec -it learning-kafka-1 /opt/kafka/bin/kafka-consumer-groups.sh \
  --bootstrap-server kafka-1:9092 \
  --describe \
  --group orders-debug
```

Reset para o inicio:

```bash
docker exec -it learning-kafka-1 /opt/kafka/bin/kafka-consumer-groups.sh \
  --bootstrap-server kafka-1:9092 \
  --group orders-debug \
  --topic orders.internal \
  --reset-offsets \
  --to-earliest \
  --execute
```

Perguntas:

- Offset pertence ao topic ou ao consumer group?
- Resetar offset apaga mensagens?
- Como reprocessar sem duplicar efeito colateral?

## 9. Retention vs compaction

Crie um topic compactado:

```bash
docker exec -it learning-kafka-1 /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server kafka-1:9092 \
  --create \
  --topic customer.snapshot \
  --partitions 3 \
  --replication-factor 3 \
  --config cleanup.policy=compact
```

Perguntas:

- Retention remove por tempo/tamanho.
- Compaction preserva o ultimo valor por key.
- Quando usar topic de eventos?
- Quando usar topic de snapshot/estado?

## 10. Checklist mental de Kafka internals

Voce deve conseguir explicar:

- Producer descobre metadata via bootstrap.
- Record e enviado ao leader da partition.
- Partition key define a partition.
- Leader grava no log local.
- Followers replicam.
- ISR representa replicas suficientemente atualizadas.
- High watermark define leitura segura.
- Consumer group distribui partitions, nao mensagens individuais.
- Offset e posicao por partition e por group.
- Rebalance redistribui partitions entre consumers.
- Retention/compaction controlam ciclo de vida do log.

## Limpar cluster

```bash
docker compose -f docker-compose.cluster.yml down -v
```
