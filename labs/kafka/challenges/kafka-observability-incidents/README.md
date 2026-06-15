# Observability e incidentes: lag, ISR, capacidade e DR

Monte um runbook de producao para lag, under-replicated partitions, broker saturado e recuperacao de desastre.

## Ambiente

- Tipo: `cluster`
- Compose local: `docker-compose.yml`
- Verificacao: `./verify.sh`

## Subir

```bash
docker compose up -d
```

## Topics esperados

- `incident.orders`

## Tarefas

- Subir cluster Kafka.
- Criar incident.orders com RF 3.
- Simular queda de broker e observar ISR.
- Definir dashboard minimo de Kafka.
- Criar runbook para lag alto e under-replicated partitions.
- Definir RPO/RTO e estrategia de DR conceitual.

## Solucao

Preencha `solution.md` com decisoes, trade-offs e evidencias. Nos desafios executaveis, o verificador checa ambiente e topics; nos desafios conceituais, ele valida se a resposta minima foi preenchida.

## Validacao sistemica

Problema que o lab precisa resolver: Validar topic replicado, ISR, round-trip e exigir runbook com lag, under-replicated partitions, disco e RPO/RTO.

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

- [ ] Topic incident.orders foi criado
- [ ] Falha de broker foi simulada ou desenhada
- [ ] Metricas principais foram listadas
- [ ] Runbook de lag alto foi escrito
- [ ] RPO/RTO e DR foram definidos
