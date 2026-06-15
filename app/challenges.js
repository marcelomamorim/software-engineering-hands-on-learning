const { kafkaChallenges } = require("./kafka-challenges");

const challenges = kafkaChallenges;

const actionDefinitions = {
  "single-up": {
    label: "Subir Kafka local",
    command: "docker compose up -d",
    cwd: "labs/kafka",
  },
  "single-status": {
    label: "Verificar Kafka local",
    command: "docker compose ps",
    cwd: "labs/kafka",
  },
  "single-down": {
    label: "Parar Kafka local",
    command: "docker compose down",
    cwd: "labs/kafka",
  },
  "cluster-up": {
    label: "Subir cluster 3 brokers",
    command: "docker compose -f docker-compose.cluster.yml up -d",
    cwd: "labs/kafka",
  },
  "cluster-create-topic": {
    label: "Criar topic replicado",
    command:
      "docker exec learning-kafka-1 /opt/kafka/bin/kafka-topics.sh --bootstrap-server kafka-1:9092 --create --if-not-exists --topic orders.internal --partitions 6 --replication-factor 3",
    cwd: ".",
  },
  "cluster-describe-topic": {
    label: "Descrever topic",
    command:
      "docker exec learning-kafka-1 /opt/kafka/bin/kafka-topics.sh --bootstrap-server kafka-1:9092 --describe --topic orders.internal",
    cwd: ".",
  },
  "cluster-create-record-topic": {
    label: "Criar record.lifecycle",
    command:
      "docker exec learning-kafka-1 /opt/kafka/bin/kafka-topics.sh --bootstrap-server kafka-1:9092 --create --if-not-exists --topic record.lifecycle --partitions 6 --replication-factor 3",
    cwd: ".",
  },
  "cluster-describe-record-topic": {
    label: "Descrever record.lifecycle",
    command:
      "docker exec learning-kafka-1 /opt/kafka/bin/kafka-topics.sh --bootstrap-server kafka-1:9092 --describe --topic record.lifecycle",
    cwd: ".",
  },
  "cluster-list-log-files": {
    label: "Inspecionar arquivos de log",
    command:
      "docker exec learning-kafka-1 bash -lc 'find /tmp/kraft-combined-logs -maxdepth 2 -type f | sort | head -80'",
    cwd: ".",
  },
  "cluster-create-finance-topic": {
    label: "Criar finance.events",
    command:
      "docker exec learning-kafka-1 /opt/kafka/bin/kafka-topics.sh --bootstrap-server kafka-1:9092 --create --if-not-exists --topic finance.events --partitions 6 --replication-factor 3",
    cwd: ".",
  },
  "cluster-describe-finance-topic": {
    label: "Descrever finance.events",
    command:
      "docker exec learning-kafka-1 /opt/kafka/bin/kafka-topics.sh --bootstrap-server kafka-1:9092 --describe --topic finance.events",
    cwd: ".",
  },
  "cluster-create-offsets-topic": {
    label: "Criar consumer.offsets.lab",
    command:
      "docker exec learning-kafka-1 /opt/kafka/bin/kafka-topics.sh --bootstrap-server kafka-1:9092 --create --if-not-exists --topic consumer.offsets.lab --partitions 6 --replication-factor 3",
    cwd: ".",
  },
  "cluster-describe-consumer-groups": {
    label: "Listar consumer groups",
    command:
      "docker exec learning-kafka-1 /opt/kafka/bin/kafka-consumer-groups.sh --bootstrap-server kafka-1:9092 --list",
    cwd: ".",
  },
  "cluster-create-rebalance-topic": {
    label: "Criar rebalance.lab",
    command:
      "docker exec learning-kafka-1 /opt/kafka/bin/kafka-topics.sh --bootstrap-server kafka-1:9092 --create --if-not-exists --topic rebalance.lab --partitions 8 --replication-factor 3",
    cwd: ".",
  },
  "cluster-create-lifecycle-topic": {
    label: "Criar order.lifecycle",
    command:
      "docker exec learning-kafka-1 /opt/kafka/bin/kafka-topics.sh --bootstrap-server kafka-1:9092 --create --if-not-exists --topic order.lifecycle --partitions 12 --replication-factor 3",
    cwd: ".",
  },
  "cluster-describe-lifecycle-topic": {
    label: "Descrever order.lifecycle",
    command:
      "docker exec learning-kafka-1 /opt/kafka/bin/kafka-topics.sh --bootstrap-server kafka-1:9092 --describe --topic order.lifecycle",
    cwd: ".",
  },
  "cluster-create-catalog-topic": {
    label: "Criar catalog.orders.v1",
    command:
      "docker exec learning-kafka-1 /opt/kafka/bin/kafka-topics.sh --bootstrap-server kafka-1:9092 --create --if-not-exists --topic catalog.orders.v1 --partitions 12 --replication-factor 3 --config retention.ms=604800000",
    cwd: ".",
  },
  "cluster-describe-catalog-topic": {
    label: "Descrever catalog.orders.v1",
    command:
      "docker exec learning-kafka-1 /opt/kafka/bin/kafka-topics.sh --bootstrap-server kafka-1:9092 --describe --topic catalog.orders.v1",
    cwd: ".",
  },
  "cluster-create-compacted-topic": {
    label: "Criar customer.snapshot compactado",
    command:
      "docker exec learning-kafka-1 /opt/kafka/bin/kafka-topics.sh --bootstrap-server kafka-1:9092 --create --if-not-exists --topic customer.snapshot --partitions 6 --replication-factor 3 --config cleanup.policy=compact --config min.cleanable.dirty.ratio=0.01",
    cwd: ".",
  },
  "cluster-describe-compacted-topic": {
    label: "Descrever customer.snapshot",
    command:
      "docker exec learning-kafka-1 /opt/kafka/bin/kafka-topics.sh --bootstrap-server kafka-1:9092 --describe --topic customer.snapshot",
    cwd: ".",
  },
  "cluster-create-transaction-topics": {
    label: "Criar topics transacionais",
    command:
      "docker exec learning-kafka-1 bash -lc '/opt/kafka/bin/kafka-topics.sh --bootstrap-server kafka-1:9092 --create --if-not-exists --topic payment.commands --partitions 6 --replication-factor 3 && /opt/kafka/bin/kafka-topics.sh --bootstrap-server kafka-1:9092 --create --if-not-exists --topic payment.events.tx --partitions 6 --replication-factor 3'",
    cwd: ".",
  },
  "cluster-create-payment-topics": {
    label: "Criar topics de pagamento",
    command:
      "docker exec learning-kafka-1 bash -lc '/opt/kafka/bin/kafka-topics.sh --bootstrap-server kafka-1:9092 --create --if-not-exists --topic payment.events --partitions 6 --replication-factor 3 && /opt/kafka/bin/kafka-topics.sh --bootstrap-server kafka-1:9092 --create --if-not-exists --topic payment.retry --partitions 6 --replication-factor 3 && /opt/kafka/bin/kafka-topics.sh --bootstrap-server kafka-1:9092 --create --if-not-exists --topic payment.dlq --partitions 6 --replication-factor 3'",
    cwd: ".",
  },
  "cluster-create-perf-topic": {
    label: "Criar perf.events",
    command:
      "docker exec learning-kafka-1 /opt/kafka/bin/kafka-topics.sh --bootstrap-server kafka-1:9092 --create --if-not-exists --topic perf.events --partitions 12 --replication-factor 3",
    cwd: ".",
  },
  "cluster-describe-perf-topic": {
    label: "Descrever perf.events",
    command:
      "docker exec learning-kafka-1 /opt/kafka/bin/kafka-topics.sh --bootstrap-server kafka-1:9092 --describe --topic perf.events",
    cwd: ".",
  },
  "cluster-create-incident-topic": {
    label: "Criar incident.orders",
    command:
      "docker exec learning-kafka-1 /opt/kafka/bin/kafka-topics.sh --bootstrap-server kafka-1:9092 --create --if-not-exists --topic incident.orders --partitions 6 --replication-factor 3",
    cwd: ".",
  },
  "cluster-describe-incident-topic": {
    label: "Descrever incident.orders",
    command:
      "docker exec learning-kafka-1 /opt/kafka/bin/kafka-topics.sh --bootstrap-server kafka-1:9092 --describe --topic incident.orders",
    cwd: ".",
  },
  "cluster-status": {
    label: "Verificar cluster",
    command: "docker compose -f docker-compose.cluster.yml ps",
    cwd: "labs/kafka",
  },
  "cluster-stop-broker-2": {
    label: "Parar broker 2",
    command: "docker stop learning-kafka-2",
    cwd: ".",
  },
  "cluster-start-broker-2": {
    label: "Iniciar broker 2",
    command: "docker start learning-kafka-2",
    cwd: ".",
  },
  "cluster-down": {
    label: "Parar cluster",
    command: "docker compose -f docker-compose.cluster.yml down",
    cwd: "labs/kafka",
  },
};

module.exports = { challenges, actionDefinitions };
