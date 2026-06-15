# Laboratorio Kafka

Laboratorio local para estudar Kafka com Docker e Python.

## Requisitos

- Docker
- Docker Compose
- Python 3.11 ou superior

## Subir Kafka

```bash
docker compose up -d
```

Verificar containers:

```bash
docker compose ps
```

## Criar ambiente Python

```bash
cd python
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Rodar produtor

```bash
python producer.py
```

## Rodar consumidor

Em outro terminal:

```bash
python consumer.py
```

## Experimentos

### 1. Ordenacao por chave

Rode o producer e observe que eventos com a mesma `order_id` preservam ordem dentro da mesma partition.

Perguntas:

- Qual campo deveria ser a key para eventos de pedido?
- O que acontece se a key for aleatoria?

### 2. Consumer lag

Altere `PROCESSING_DELAY_SECONDS` em `consumer.py` para `2`.

Perguntas:

- O lag cresce?
- Como voce mediria isso em producao?
- O que e melhor: mais consumers, mais partitions ou processamento mais rapido?

### 3. Reprocessamento

Troque `AUTO_OFFSET_RESET` para `earliest` e use um novo `GROUP_ID`.

Perguntas:

- Por que um novo consumer group releria eventos antigos?
- Como evitar duplicar efeitos colaterais?

### 4. Falha durante processamento

Interrompa o consumer enquanto ele processa mensagens.

Perguntas:

- O offset foi commitado?
- A mensagem pode ser processada mais de uma vez?
- Que parte do seu codigo precisa ser idempotente?

## Limpar ambiente

```bash
docker compose down -v
```

## Laboratorio avancado

Para estudar o funcionamento interno do Kafka, suba um cluster com 3 brokers:

```bash
docker compose -f docker-compose.cluster.yml up -d
```

Depois siga [internals.md](internals.md).
