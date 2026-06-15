# Transactions e exactly-once semantics

Estude idempotent producer, transactions, isolation.level=read_committed e os limites do exactly-once.

## Ambiente

- Tipo: `cluster`
- Compose local: `docker-compose.yml`
- Verificacao: `./verify.sh`

## Subir

```bash
docker compose up -d
```

## Topics esperados

- `payment.commands`
- `payment.events.tx`

## Tarefas

- Desenhar fluxo consume-transform-produce transacional.
- Criar payment.commands e payment.events.
- Definir transactional.id por instancia.
- Explicar commit de offsets dentro da transacao.
- Separar exatamente-uma-vez no Kafka de exatamente-uma-vez no sistema externo.

## Solucao

Preencha `solution.md` com decisoes, trade-offs e evidencias. Nos desafios executaveis, o verificador checa ambiente e topics; nos desafios conceituais, ele valida se a resposta minima foi preenchida.

## Validacao sistemica

Problema que o lab precisa resolver: Validar topics transacionais, RF e exigir transactional.id, read_committed, idempotencia e offset em transacao.

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

- [ ] Fluxo transacional foi desenhado
- [ ] transactional.id foi definido
- [ ] read_committed foi explicado
- [ ] Offsets dentro da transacao foram explicados
- [ ] Limites com sistemas externos foram documentados
