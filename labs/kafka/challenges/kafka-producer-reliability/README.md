# Producer confiavel: acks, retries e idempotencia

Configure producer para durabilidade com acks=all, retries, idempotencia e ordenacao controlada.

## Ambiente

- Tipo: `cluster`
- Compose local: `docker-compose.yml`
- Verificacao: `./verify.sh`

## Subir

```bash
docker compose up -d
```

## Topics esperados

- `finance.events`

## Tarefas

- Subir cluster Kafka.
- Criar finance.events com RF 3.
- Definir configuracao de producer confiavel.
- Simular falha de broker durante producao.
- Comparar risco de acks=1 com acks=all.

## Solucao

Preencha `solution.md` com decisoes, trade-offs e evidencias. Nos desafios executaveis, o verificador checa ambiente e topics; nos desafios conceituais, ele valida se a resposta minima foi preenchida.

## Validacao sistemica

Problema que o lab precisa resolver: Validar topic com RF >= 3, min.insync.replicas=2, round-trip e justificativas de acks, retries, idempotencia e ordering.

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
- [ ] Topic finance.events foi criado com RF 3
- [ ] Configuracao de producer confiavel foi definida
- [ ] Voce comparou acks=1 e acks=all
- [ ] Voce explicou idempotent producer
