# Kafka internals: ciclo de vida do record

Siga um record desde o producer ate os arquivos de log, segmentos, indices e page cache.

## Ambiente

- Tipo: `cluster`
- Compose local: `docker-compose.yml`
- Verificacao: `./verify.sh`

## Subir

```bash
docker compose up -d
```

## Topics esperados

- `record.lifecycle`

## Tarefas

- Subir o cluster de 3 brokers.
- Criar um topic record.lifecycle com 6 partitions e RF 3.
- Produzir eventos com key e payload pequeno.
- Inspecionar arquivos .log, .index e .timeindex em /tmp/kraft-combined-logs.
- Relacionar append sequencial, batching e page cache ao throughput.

## Solucao

Preencha `solution.md` com decisoes, trade-offs e evidencias. Nos desafios executaveis, o verificador checa ambiente e topics; nos desafios conceituais, ele valida se a resposta minima foi preenchida.

## Validacao sistemica

Problema que o lab precisa resolver: Produzir records, consumir de volta e verificar que o broker materializou diretorios de partition e arquivos .index no log interno.

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

- [ ] Cluster esta rodando
- [ ] Topic record.lifecycle foi criado
- [ ] Eventos foram produzidos
- [ ] Arquivos .log, .index e .timeindex foram localizados
- [ ] Voce explicou page cache e append-only
