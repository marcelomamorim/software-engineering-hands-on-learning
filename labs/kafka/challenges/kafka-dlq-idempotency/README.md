# Kafka: DLQ, poison message e idempotencia

Desenhe o comportamento de consumidores diante de mensagens invalidas, retries e efeitos colaterais duplicados.

## Ambiente

- Tipo: `cluster`
- Compose local: `docker-compose.yml`
- Verificacao: `./verify.sh`

## Subir

```bash
docker compose up -d
```

## Topics esperados

- `payment.events`
- `payment.retry`
- `payment.dlq`

## Tarefas

- Criar payment.events, payment.retry e payment.dlq.
- Definir quais erros sao retryable e quais vao direto para DLQ.
- Definir idempotency key: event_id para consumo e payment_id para cobranca externa.
- Especificar payload minimo da DLQ com erro, evento original e timestamp.
- Descrever processo de replay da DLQ.

## Solucao

Preencha `solution.md` com decisoes, trade-offs e evidencias. Nos desafios executaveis, o verificador checa ambiente e topics; nos desafios conceituais, ele valida se a resposta minima foi preenchida.

## Validacao sistemica

Problema que o lab precisa resolver: Validar topics principal/retry/DLQ, round-trip e exigir estrategia de poison message, replay e idempotencia.

O script `./verify.sh` nao verifica apenas se arquivos existem. Ele tenta observar o sistema em execucao: containers, bootstrap Kafka, topics, configuracoes, producao/consumo de mensagens, offsets, ISR ou evidencias obrigatorias em `solution.md`, dependendo do desafio.

Para passar, resolva o problema do cenario e rode:

```bash
./verify.sh
```

## Verificar

```bash
./verify.sh
```

## Encerrar

```bash
docker compose down -v
```

## Checklist

- [ ] Topics payment.events, payment.retry e payment.dlq foram definidos
- [ ] Voce separou erros retryable e non-retryable
- [ ] Voce definiu idempotency key
- [ ] Voce documentou payload de DLQ
- [ ] Voce explicou como reprocessar DLQ sem duplicar cobranca
