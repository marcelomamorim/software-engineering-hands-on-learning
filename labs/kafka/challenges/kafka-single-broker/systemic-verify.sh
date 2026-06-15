#!/usr/bin/env bash
set -euo pipefail

SCENARIO="${1:?Informe o id do cenario Kafka.}"

pass() {
  echo "OK: $1"
}

fail() {
  echo "Pendente: $1"
  exit 1
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "comando '$1' nao encontrado."
}

contains_ci() {
  local file="$1"
  local term="$2"
  grep -Eiq "$term" "$file"
}

require_solution_sections() {
  [ -s solution.md ] || fail "preencha solution.md com a solucao e evidencias."
  for heading in "Contexto" "Decisoes" "Trade-offs" "Validacao"; do
    contains_ci solution.md "$heading" || fail "solution.md deve conter a secao '$heading'."
  done
}

require_solution_terms() {
  local missing=()
  for term in "$@"; do
    if ! contains_ci solution.md "$term"; then
      missing+=("$term")
    fi
  done
  if [ "${#missing[@]}" -gt 0 ]; then
    fail "solution.md ainda nao evidencia estes conceitos: ${missing[*]}"
  fi
}

setup_single() {
  BOOTSTRAP="localhost:9092"
  EXEC=(docker exec learning-kafka)
  CONTAINERS=(learning-kafka)
}

setup_cluster() {
  BOOTSTRAP="kafka-1:9092"
  EXEC=(docker exec learning-kafka-1)
  CONTAINERS=(learning-kafka-1 learning-kafka-2 learning-kafka-3)
}

require_containers() {
  require_command docker
  for container in "${CONTAINERS[@]}"; do
    docker ps --format '{{.Names}}' | grep -qx "$container" ||
      fail "container $container nao esta rodando. Rode docker compose up -d."
  done
}

require_kafka_ready() {
  if ! "${EXEC[@]}" /opt/kafka/bin/kafka-broker-api-versions.sh \
    --bootstrap-server "$BOOTSTRAP" >/dev/null 2>&1; then
    fail "Kafka ainda nao respondeu em $BOOTSTRAP."
  fi
  pass "Kafka respondeu em $BOOTSTRAP"
}

topic_describe() {
  "${EXEC[@]}" /opt/kafka/bin/kafka-topics.sh \
    --bootstrap-server "$BOOTSTRAP" \
    --describe \
    --topic "$1" 2>/dev/null
}

require_topic() {
  local topic="$1"
  topic_describe "$topic" >/dev/null || fail "topic $topic nao encontrado."
  pass "topic $topic existe"
}

require_partitions_at_least() {
  local topic="$1"
  local expected="$2"
  local partitions
  partitions="$(topic_describe "$topic" | awk -F'PartitionCount: ' '/PartitionCount:/ { split($2,a," "); print a[1]; exit }')"
  [ -n "$partitions" ] || fail "nao foi possivel ler PartitionCount de $topic."
  [ "$partitions" -ge "$expected" ] ||
    fail "$topic precisa ter pelo menos $expected partitions; atual: $partitions."
  pass "$topic tem $partitions partitions"
}

require_replication_at_least() {
  local topic="$1"
  local expected="$2"
  local rf
  rf="$(topic_describe "$topic" | awk -F'ReplicationFactor: ' '/ReplicationFactor:/ { split($2,a," "); print a[1]; exit }')"
  [ -n "$rf" ] || fail "nao foi possivel ler ReplicationFactor de $topic."
  [ "$rf" -ge "$expected" ] ||
    fail "$topic precisa ter replication factor >= $expected; atual: $rf."
  pass "$topic tem replication factor $rf"
}

require_topic_config() {
  local topic="$1"
  local config="$2"
  local description
  description="$(topic_describe "$topic")"
  echo "$description" | grep -q "$config" ||
    fail "$topic precisa expor a configuracao '$config'."
  pass "$topic contem configuracao $config"
}

produce_records() {
  local topic="$1"
  local records="$2"
  printf "%b" "$records" | "${EXEC[@]}" /opt/kafka/bin/kafka-console-producer.sh \
    --bootstrap-server "$BOOTSTRAP" \
    --topic "$topic" \
    --property parse.key=true \
    --property key.separator=: >/dev/null
}

consume_records() {
  local topic="$1"
  local group="$2"
  local max_messages="$3"
  "${EXEC[@]}" /opt/kafka/bin/kafka-console-consumer.sh \
    --bootstrap-server "$BOOTSTRAP" \
    --topic "$topic" \
    --group "$group" \
    --from-beginning \
    --timeout-ms 10000 \
    --max-messages "$max_messages" 2>/dev/null || true
}

require_roundtrip() {
  local topic="$1"
  local key="$2"
  local value="$3"
  local marker="verify-${SCENARIO}-$(date +%s)"
  produce_records "$topic" "${key}:${marker}-${value}\n"
  local output
  output="$(consume_records "$topic" "verify-${SCENARIO}-${marker}" 1)"
  echo "$output" | grep -q "${marker}-${value}" ||
    fail "record de prova nao foi consumido de volta em $topic."
  pass "record de prova publicou e foi consumido em $topic"
}

require_partition_log_files() {
  local topic="$1"
  "${EXEC[@]}" sh -c "find /tmp/kraft-combined-logs -name '${topic}-*' -type d | grep -q ." ||
    fail "nao encontrei diretorios de log para $topic em /tmp/kraft-combined-logs."
  "${EXEC[@]}" sh -c "find /tmp/kraft-combined-logs -path '*${topic}-*/*.index' | grep -q ." ||
    fail "nao encontrei arquivos .index para $topic; produza records para materializar segmentos."
  pass "broker materializou diretorios de partition e indices para $topic"
}

require_isr_size_at_least() {
  local topic="$1"
  local expected="$2"
  local isr_line
  isr_line="$(topic_describe "$topic" | awk -F'Isr: ' '/Isr:/ { print $2; exit }')"
  [ -n "$isr_line" ] || fail "nao foi possivel ler ISR de $topic."
  local count
  count="$(echo "$isr_line" | tr ',' '\n' | awk 'NF { c++ } END { print c+0 }')"
  [ "$count" -ge "$expected" ] ||
    fail "$topic precisa ter pelo menos $expected replicas no ISR; atual: $isr_line."
  pass "$topic tem ISR com $count replicas"
}

require_consumer_group_progress() {
  local topic="$1"
  local group="$2"
  "${EXEC[@]}" /opt/kafka/bin/kafka-consumer-groups.sh \
    --bootstrap-server "$BOOTSTRAP" \
    --describe \
    --group "$group" 2>/dev/null | awk -v topic="$topic" '$2 == topic && $4 ~ /^[0-9]+$/ { found=1 } END { exit found ? 0 : 1 }' ||
    fail "grupo $group nao mostrou offset commitado para $topic."
  pass "grupo $group tem progresso commitado em $topic"
}

verify_single_broker() {
  setup_single
  require_containers
  require_kafka_ready
  require_topic "orders.events"
  require_roundtrip "orders.events" "ORD-1001" "OrderCreated"
  require_solution_sections
  require_solution_terms "offset" "commit" "group.id|consumer group" "idempot"
}

verify_record_lifecycle() {
  setup_cluster
  require_containers
  require_kafka_ready
  require_topic "record.lifecycle"
  produce_records "record.lifecycle" "ORD-2001:created\nORD-2001:paid\nORD-2001:reserved\n"
  require_roundtrip "record.lifecycle" "ORD-2001" "lifecycle-probe"
  require_partition_log_files "record.lifecycle"
  require_solution_sections
  require_solution_terms "segment" "index" "page cache|cache" "append"
}

verify_producer_reliability() {
  setup_cluster
  require_containers
  require_kafka_ready
  require_topic "finance.events"
  require_replication_at_least "finance.events" 3
  require_topic_config "finance.events" "min.insync.replicas=2"
  require_roundtrip "finance.events" "TX-3001" "PaymentCaptured"
  require_solution_sections
  require_solution_terms "acks=all|acks" "retry" "idempot" "max.in.flight|ordering"
}

verify_consumer_offsets() {
  setup_cluster
  require_containers
  require_kafka_ready
  require_topic "consumer.offsets.lab"
  produce_records "consumer.offsets.lab" "ORD-4001:created\nORD-4002:created\nORD-4003:created\n"
  consume_records "consumer.offsets.lab" "verify-offsets-systemic" 3 >/dev/null
  require_consumer_group_progress "consumer.offsets.lab" "verify-offsets-systemic"
  require_solution_sections
  require_solution_terms "manual" "auto.commit|commit automatico" "reset" "lag"
}

verify_internals_cluster() {
  setup_cluster
  require_containers
  require_kafka_ready
  require_topic "orders.internal"
  require_replication_at_least "orders.internal" 3
  require_isr_size_at_least "orders.internal" 2
  require_roundtrip "orders.internal" "ORD-5001" "ClusterProbe"
  require_solution_sections
  require_solution_terms "leader" "follower" "ISR|in-sync" "high watermark"
}

verify_rebalance_protocols() {
  setup_cluster
  require_containers
  require_kafka_ready
  require_topic "rebalance.lab"
  require_partitions_at_least "rebalance.lab" 3
  require_roundtrip "rebalance.lab" "rebalance-key" "RebalanceProbe"
  require_solution_sections
  require_solution_terms "eager" "cooperative" "static" "assignment|partitions"
}

verify_partition_key_ordering() {
  setup_cluster
  require_containers
  require_kafka_ready
  require_topic "order.lifecycle"
  produce_records "order.lifecycle" "ORD-6001:01-created\nORD-6001:02-paid\nORD-6001:03-shipped\n"
  local output
  output="$(consume_records "order.lifecycle" "verify-ordering-systemic-$(date +%s)" 3)"
  echo "$output" | grep -q "01-created" && echo "$output" | grep -q "02-paid" && echo "$output" | grep -q "03-shipped" ||
    fail "nao consegui observar os tres eventos de uma mesma key em order.lifecycle."
  require_solution_sections
  require_solution_terms "key" "partition" "hot partition|hot" "ordem|ordering"
  pass "eventos de mesma key foram observados em order.lifecycle"
}

verify_topic_design() {
  setup_cluster
  require_containers
  require_kafka_ready
  require_topic "catalog.orders.v1"
  require_partitions_at_least "catalog.orders.v1" 3
  require_replication_at_least "catalog.orders.v1" 3
  require_solution_sections
  require_solution_terms "naming|nome" "retention" "owner|ownership|dono" "replication"
}

verify_retention_compaction() {
  setup_cluster
  require_containers
  require_kafka_ready
  require_topic "customer.snapshot"
  require_topic_config "customer.snapshot" "cleanup.policy=compact"
  produce_records "customer.snapshot" "C-7001:{\"status\":\"active\"}\nC-7001:{\"status\":\"updated\"}\n"
  require_roundtrip "customer.snapshot" "C-7002" "SnapshotProbe"
  require_solution_sections
  require_solution_terms "compact" "tombstone" "retention" "replay"
}

verify_transactions_eos() {
  setup_cluster
  require_containers
  require_kafka_ready
  require_topic "payment.commands"
  require_topic "payment.events.tx"
  require_replication_at_least "payment.events.tx" 3
  require_roundtrip "payment.commands" "PAY-8001" "AuthorizePayment"
  require_solution_sections
  require_solution_terms "transactional.id|transaction" "read_committed" "idempot" "offset"
}

verify_dlq_idempotency() {
  setup_cluster
  require_containers
  require_kafka_ready
  require_topic "payment.events"
  require_topic "payment.retry"
  require_topic "payment.dlq"
  require_roundtrip "payment.events" "PAY-9001" "PaymentFailed"
  require_solution_sections
  require_solution_terms "retry" "DLQ|dead.?letter" "poison" "idempot" "replay"
}

verify_performance_tuning() {
  setup_cluster
  require_containers
  require_kafka_ready
  require_topic "perf.events"
  require_partitions_at_least "perf.events" 3
  require_roundtrip "perf.events" "PERF-1001" "PerformanceProbe"
  require_solution_sections
  require_solution_terms "batch" "linger" "compression" "throughput" "latency"
}

verify_observability_incidents() {
  setup_cluster
  require_containers
  require_kafka_ready
  require_topic "incident.orders"
  require_replication_at_least "incident.orders" 3
  require_isr_size_at_least "incident.orders" 2
  require_roundtrip "incident.orders" "INC-1101" "IncidentProbe"
  require_solution_sections
  require_solution_terms "lag" "under.?replicated|ISR" "disk|disco" "runbook" "RPO|RTO"
}

verify_design_kraft() {
  require_solution_sections
  require_solution_terms "KRaft" "controller" "quorum" "metadata log|log de metadata" "ZooKeeper"
  pass "solution.md cobre o desenho sistemico de KRaft"
}

verify_design_schema() {
  require_solution_sections
  require_solution_terms "backward|retrocompat" "forward" "optional|opcional" "schema|contrato" "version"
  pass "solution.md cobre compatibilidade e versionamento de schema"
}

verify_design_outbox() {
  require_solution_sections
  require_solution_terms "outbox" "CDC" "transaction|transacao" "relay" "idempot"
  pass "solution.md cobre outbox/CDC e publicacao confiavel"
}

verify_design_streams() {
  require_solution_sections
  require_solution_terms "state store" "changelog" "join" "window|janela" "reprocess"
  pass "solution.md cobre processamento de streams com estado"
}

verify_design_security() {
  require_solution_sections
  require_solution_terms "TLS" "SASL" "ACL" "quota" "principal|tenant"
  pass "solution.md cobre seguranca, ACLs e quotas"
}

case "$SCENARIO" in
  kafka-single-broker) verify_single_broker ;;
  kafka-record-lifecycle) verify_record_lifecycle ;;
  kafka-producer-reliability) verify_producer_reliability ;;
  kafka-consumer-offsets) verify_consumer_offsets ;;
  kafka-internals-cluster) verify_internals_cluster ;;
  kafka-kraft-metadata) verify_design_kraft ;;
  kafka-rebalance-protocols) verify_rebalance_protocols ;;
  kafka-partition-key-ordering) verify_partition_key_ordering ;;
  kafka-topic-design) verify_topic_design ;;
  kafka-retention-compaction) verify_retention_compaction ;;
  kafka-schema-evolution) verify_design_schema ;;
  kafka-transactions-eos) verify_transactions_eos ;;
  kafka-dlq-idempotency) verify_dlq_idempotency ;;
  kafka-outbox-cdc) verify_design_outbox ;;
  kafka-stream-processing) verify_design_streams ;;
  kafka-performance-tuning) verify_performance_tuning ;;
  kafka-security-quotas) verify_design_security ;;
  kafka-observability-incidents) verify_observability_incidents ;;
  *) fail "cenario desconhecido: $SCENARIO" ;;
esac

echo "SUCESSO: validacao sistemica concluida para $SCENARIO."
