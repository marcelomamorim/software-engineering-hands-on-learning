const fsp = require("node:fs/promises");
const path = require("node:path");
const { kafkaChallenges } = require("../app/kafka-challenges");
const { actionDefinitions } = require("../app/challenges");

const rootDir = path.resolve(__dirname, "..");
const labsRoot = path.join(rootDir, "labs", "kafka", "challenges");
const docsDir = path.join(rootDir, "docs", "kafka");

const topicByAction = {
  "cluster-create-topic": "orders.internal",
  "cluster-create-record-topic": "record.lifecycle",
  "cluster-create-finance-topic": "finance.events",
  "cluster-create-offsets-topic": "consumer.offsets.lab",
  "cluster-create-rebalance-topic": "rebalance.lab",
  "cluster-create-lifecycle-topic": "order.lifecycle",
  "cluster-create-catalog-topic": "catalog.orders.v1",
  "cluster-create-compacted-topic": "customer.snapshot",
  "cluster-create-perf-topic": "perf.events",
  "cluster-create-incident-topic": "incident.orders",
};

const multiTopicByAction = {
  "cluster-create-transaction-topics": ["payment.commands", "payment.events.tx"],
  "cluster-create-payment-topics": ["payment.events", "payment.retry", "payment.dlq"],
};

const singleCompose = `services:
  kafka:
    image: apache/kafka:3.9.0
    container_name: learning-kafka
    ports:
      - "9092:9092"
    environment:
      KAFKA_CLUSTER_ID: MkU3OEVBNTcwNTJENDM2Qk
      KAFKA_NODE_ID: 1
      KAFKA_PROCESS_ROLES: broker,controller
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@kafka:9093
      KAFKA_LISTENERS: PLAINTEXT://:9092,CONTROLLER://:9093
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: true
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 1
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 1
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_LOG_DIRS: /tmp/kraft-combined-logs
`;

const clusterCompose = `services:
  kafka-1:
    image: apache/kafka:3.9.0
    container_name: learning-kafka-1
    ports:
      - "19092:19092"
    environment:
      KAFKA_CLUSTER_ID: MkU3OEVBNTcwNTJENDM2Qk
      KAFKA_NODE_ID: 1
      KAFKA_PROCESS_ROLES: broker,controller
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@kafka-1:9093,2@kafka-2:9093,3@kafka-3:9093
      KAFKA_LISTENERS: PLAINTEXT://:9092,CONTROLLER://:9093,EXTERNAL://:19092
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka-1:9092,EXTERNAL://localhost:19092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,EXTERNAL:PLAINTEXT
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 3
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 3
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 2
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_LOG_DIRS: /tmp/kraft-combined-logs

  kafka-2:
    image: apache/kafka:3.9.0
    container_name: learning-kafka-2
    ports:
      - "29092:29092"
    environment:
      KAFKA_CLUSTER_ID: MkU3OEVBNTcwNTJENDM2Qk
      KAFKA_NODE_ID: 2
      KAFKA_PROCESS_ROLES: broker,controller
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@kafka-1:9093,2@kafka-2:9093,3@kafka-3:9093
      KAFKA_LISTENERS: PLAINTEXT://:9092,CONTROLLER://:9093,EXTERNAL://:29092
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka-2:9092,EXTERNAL://localhost:29092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,EXTERNAL:PLAINTEXT
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 3
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 3
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 2
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_LOG_DIRS: /tmp/kraft-combined-logs

  kafka-3:
    image: apache/kafka:3.9.0
    container_name: learning-kafka-3
    ports:
      - "39092:39092"
    environment:
      KAFKA_CLUSTER_ID: MkU3OEVBNTcwNTJENDM2Qk
      KAFKA_NODE_ID: 3
      KAFKA_PROCESS_ROLES: broker,controller
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@kafka-1:9093,2@kafka-2:9093,3@kafka-3:9093
      KAFKA_LISTENERS: PLAINTEXT://:9092,CONTROLLER://:9093,EXTERNAL://:39092
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka-3:9092,EXTERNAL://localhost:39092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,EXTERNAL:PLAINTEXT
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 3
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 3
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 2
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_LOG_DIRS: /tmp/kraft-combined-logs
`;

const designCompose = `services:
  checklist:
    image: busybox:1.36
    command: ["sh", "-c", "echo 'Desafio conceitual: preencha solution.md e rode ./verify.sh' && sleep 3600"]
    volumes:
      - ./:/workspace
    working_dir: /workspace
`;

function topicsFor(challenge) {
  const topics = new Set();
  for (const action of challenge.actions || []) {
    if (topicByAction[action]) {
      topics.add(topicByAction[action]);
    }
    for (const topic of multiTopicByAction[action] || []) {
      topics.add(topic);
    }
  }
  if (challenge.id === "kafka-single-broker") {
    topics.add("orders.events");
  }
  return [...topics];
}

function composeFor(environment) {
  if (environment === "single") {
    return singleCompose;
  }
  if (environment === "cluster") {
    return clusterCompose;
  }
  return designCompose;
}

function verifyScript(challenge, topics) {
  const topicChecks = topics
    .map(
      (topic) => `
if ! $EXEC /opt/kafka/bin/kafka-topics.sh --bootstrap-server "$BOOTSTRAP" --describe --topic "${topic}" >/dev/null 2>&1; then
  echo "Pendente: topic ${topic} nao encontrado. Crie o topic antes de avaliar."
  exit 1
fi`
    )
    .join("\n");

  if (challenge.environment === "none") {
    return `#!/usr/bin/env bash
set -euo pipefail

if [ ! -s solution.md ]; then
  echo "Pendente: crie e preencha solution.md com sua resposta do desafio."
  exit 1
fi

for heading in "Contexto" "Decisoes" "Trade-offs" "Validacao"; do
  if ! grep -qi "$heading" solution.md; then
    echo "Pendente: solution.md deve conter uma secao '$heading'."
    exit 1
  fi
done

echo "OK: resposta conceitual minima encontrada em solution.md."
`;
  }

  const single = challenge.environment === "single";
  const containers = single ? ["learning-kafka"] : ["learning-kafka-1", "learning-kafka-2", "learning-kafka-3"];
  const containerChecks = containers
    .map(
      (container) => `
if ! docker ps --format '{{.Names}}' | grep -qx "${container}"; then
  echo "Pendente: container ${container} nao esta rodando."
  exit 1
fi`
    )
    .join("\n");
  const execContainer = single ? "learning-kafka" : "learning-kafka-1";
  const bootstrap = single ? "localhost:9092" : "kafka-1:9092";

  return `#!/usr/bin/env bash
set -euo pipefail

BOOTSTRAP="${bootstrap}"
EXEC="docker exec ${execContainer}"

${containerChecks}

if ! $EXEC /opt/kafka/bin/kafka-broker-api-versions.sh --bootstrap-server "$BOOTSTRAP" >/dev/null 2>&1; then
  echo "Pendente: Kafka ainda nao respondeu em $BOOTSTRAP."
  exit 1
fi
${topicChecks}

if [ -s solution.md ]; then
  echo "OK: ambiente Kafka respondeu e solution.md existe."
else
  echo "OK: ambiente Kafka respondeu. Opcional: preencha solution.md com as respostas e evidencias."
fi
`;
}
function solutionTemplate(challenge) {
  return `# ${challenge.title}

## Contexto

Descreva o cenario com suas palavras.

## Decisoes

- Decisao 1:
- Decisao 2:
- Decisao 3:

## Trade-offs

Explique custo, risco, latencia, durabilidade, ordenacao, operacao ou seguranca.

## Validacao

Cole evidencias: comandos executados, saidas importantes, metricas observadas ou explicacao da avaliacao.
`;
}

function readme(challenge, topics) {
  const up = challenge.environment === "none" ? "docker compose up -d" : "docker compose up -d";
  const topicText = topics.length ? topics.map((topic) => `- \`${topic}\``).join("\n") : "- Este desafio e conceitual; nao exige topic obrigatorio.";
  const tasks = (challenge.tasks || []).map((task) => `- ${task}`).join("\n");
  const checklist = (challenge.checklist || []).map((item) => `- [ ] ${item}`).join("\n");

  return `# ${challenge.title}

${challenge.summary}

## Ambiente

- Tipo: \`${challenge.environment}\`
- Compose local: \`docker-compose.yml\`
- Verificacao: \`./verify.sh\`

## Subir

\`\`\`bash
${up}
\`\`\`

## Topics esperados

${topicText}

## Tarefas

${tasks}

## Solucao

Preencha \`solution.md\` com decisoes, trade-offs e evidencias. Nos desafios executaveis, o verificador checa ambiente e topics; nos desafios conceituais, ele valida se a resposta minima foi preenchida.

## Verificar

\`\`\`bash
./verify.sh
\`\`\`

## Encerrar

\`\`\`bash
docker compose down -v
\`\`\`

## Checklist

${checklist}
`;
}

async function writeChallenge(challenge) {
  const dir = path.join(labsRoot, challenge.id);
  const topics = topicsFor(challenge);
  await fsp.mkdir(dir, { recursive: true });
  await fsp.writeFile(path.join(dir, "docker-compose.yml"), composeFor(challenge.environment), "utf-8");
  await fsp.writeFile(path.join(dir, "README.md"), readme(challenge, topics), "utf-8");
  await fsp.writeFile(path.join(dir, "solution.md"), solutionTemplate(challenge), "utf-8");
  const verifyPath = path.join(dir, "verify.sh");
  await fsp.writeFile(verifyPath, verifyScript(challenge, topics), "utf-8");
  await fsp.chmod(verifyPath, 0o755);
}

async function writeIndex(challenges) {
  const rows = challenges
    .map((challenge) => {
      const topics = topicsFor(challenge);
      return `| [${challenge.title}](../../labs/kafka/challenges/${challenge.id}/README.md) | \`${challenge.environment}\` | ${topics.map((topic) => `\`${topic}\``).join(", ") || "conceitual"} | \`${challenge.id}\` |`;
    })
    .join("\n");

  await fsp.writeFile(
    path.join(docsDir, "challenges.md"),
    `# Desafios Kafka

Cada desafio tem uma pasta propria em \`labs/kafka/challenges/<id>\` com:

- \`docker-compose.yml\` para subir o ambiente do desafio.
- \`README.md\` com tarefas e checklist.
- \`solution.md\` para registrar respostas e evidencias.
- \`verify.sh\` para validar sinais minimos de conclusao.

## Como usar

\`\`\`bash
cd labs/kafka/challenges/kafka-single-broker
docker compose up -d
./verify.sh
\`\`\`

## Lista

| Desafio | Ambiente | Topics verificados | ID |
| --- | --- | --- | --- |
${rows}
`,
    "utf-8"
  );
}

async function main() {
  const challenges = kafkaChallenges.filter((challenge) => challenge.id !== "kafka-study-guide");
  await fsp.rm(labsRoot, { recursive: true, force: true });
  await Promise.all(challenges.map(writeChallenge));
  await writeIndex(challenges);
  console.log(`Generated ${challenges.length} Kafka challenge labs in labs/kafka/challenges`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
