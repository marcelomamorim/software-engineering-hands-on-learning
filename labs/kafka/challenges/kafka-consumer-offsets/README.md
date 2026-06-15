# Consumer offsets: commits, lag e reset

Explore commit manual, consumer lag, reset de offsets e reprocessamento seguro.

## Ambiente

- Tipo: `cluster`
- Compose local: `docker-compose.yml`
- Verificacao: `./verify.sh`

## Subir

```bash
docker compose up -d
```

## Topics esperados

- `consumer.offsets.lab`

## Tarefas

- Subir cluster Kafka.
- Criar consumer.offsets.lab com 6 partitions.
- Produzir um lote de eventos e consumir com group.id fixo.
- Usar kafka-consumer-groups.sh para medir lag.
- Resetar offsets de um grupo de teste para earliest.

## Solucao

Preencha `solution.md` com decisoes, trade-offs e evidencias. Nos desafios executaveis, o verificador checa ambiente e topics; nos desafios conceituais, ele valida se a resposta minima foi preenchida.

## Validacao sistemica

Problema que o lab precisa resolver: Produzir mensagens, consumir com um grupo de verificacao e checar offset commitado via kafka-consumer-groups.

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

- [ ] Topic consumer.offsets.lab foi criado
- [ ] Consumer group foi criado
- [ ] Lag foi medido
- [ ] Reset de offset foi especificado ou executado em grupo de teste
- [ ] Replay seguro foi documentado
