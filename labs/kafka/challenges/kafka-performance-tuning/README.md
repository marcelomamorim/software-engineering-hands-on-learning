# Performance tuning: batching, compressao e throughput

Ajuste producer e consumer para comparar throughput, latencia, compressao, batch e fetch.

## Ambiente

- Tipo: `cluster`
- Compose local: `docker-compose.yml`
- Verificacao: `./verify.sh`

## Subir

```bash
docker compose up -d
```

## Topics esperados

- `perf.events`

## Tarefas

- Criar perf.events com 12 partitions.
- Definir baseline de producer sem tuning.
- Comparar linger.ms=0 e linger.ms=20.
- Comparar compressao none, lz4 e zstd conceitualmente ou com producer-perf-test.
- Ajustar fetch.min.bytes e max.poll.records para consumer.

## Solucao

Preencha `solution.md` com decisoes, trade-offs e evidencias. Nos desafios executaveis, o verificador checa ambiente e topics; nos desafios conceituais, ele valida se a resposta minima foi preenchida.

## Validacao sistemica

Problema que o lab precisa resolver: Validar topic particionado, round-trip e exigir analise de batch, linger, compression, throughput e latencia.

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

- [ ] Topic perf.events foi criado
- [ ] Baseline foi definido
- [ ] Batching e linger foram comparados
- [ ] Compressao foi avaliada
- [ ] Configs de consumer fetch foram analisadas
