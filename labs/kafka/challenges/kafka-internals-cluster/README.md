# Kafka internals: replication, ISR e leader election

Use um cluster com 3 brokers para observar leaders, replicas, ISR, falha de broker, high watermark e rebalance.

## Ambiente

- Tipo: `cluster`
- Compose local: `docker-compose.yml`
- Verificacao: `./verify.sh`

## Subir

```bash
docker compose up -d
```

## Topics esperados

- `orders.internal`

## Tarefas

- Subir cluster Kafka com 3 brokers.
- Criar orders.internal com 6 partitions e replication factor 3.
- Descrever o topic e registrar leader, replicas e ISR de pelo menos 3 partitions.
- Parar o broker 2 e descrever o topic novamente.
- Subir o broker 2 e observar quando ele volta ao ISR.
- Criar um consumer group e observar distribuicao de partitions entre consumers.

## Solucao

Preencha `solution.md` com decisoes, trade-offs e evidencias. Nos desafios executaveis, o verificador checa ambiente e topics; nos desafios conceituais, ele valida se a resposta minima foi preenchida.

## Validacao sistemica

Problema que o lab precisa resolver: Validar cluster com RF >= 3, ISR com pelo menos 2 replicas e round-trip em topic replicado.

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

- [ ] Cluster com 3 brokers esta rodando
- [ ] Topic orders.internal foi criado com 6 partitions e replication factor 3
- [ ] Voce descreveu leaders, replicas e ISR
- [ ] Voce parou um broker e observou leader election
- [ ] Voce criou um consumer group e observou assignment
- [ ] Voce resetou offsets e explicou reprocessamento
