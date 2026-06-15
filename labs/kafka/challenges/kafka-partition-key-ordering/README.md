# Kafka: chave de particionamento e ordenacao

Projete a partition key para manter ordem por pedido sem criar hot partitions.

## Ambiente

- Tipo: `cluster`
- Compose local: `docker-compose.yml`
- Verificacao: `./verify.sh`

## Subir

```bash
docker compose up -d
```

## Topics esperados

- `order.lifecycle`

## Tarefas

- Criar um topic order.lifecycle com 12 partitions e RF 3.
- Publicar eventos usando order_id como key.
- Publicar outro lote usando customer_id como key.
- Comparar distribuicao, ordenacao e risco de hot partition.
- Definir como detectar hot partition em metricas.

## Solucao

Preencha `solution.md` com decisoes, trade-offs e evidencias. Nos desafios executaveis, o verificador checa ambiente e topics; nos desafios conceituais, ele valida se a resposta minima foi preenchida.

## Validacao sistemica

Problema que o lab precisa resolver: Produzir eventos sequenciais com a mesma key e exigir explicacao de ordering por partition e risco de hot partition.

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

- [ ] Topic order.lifecycle foi criado com 12 partitions
- [ ] Voce comparou order_id, customer_id e event_id
- [ ] Voce explicou ordenacao por partition, nao global
- [ ] Voce identificou risco de hot partition
- [ ] Voce definiu metricas de skew e lag por partition
