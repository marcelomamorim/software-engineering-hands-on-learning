# Consumer rebalancing: eager, cooperative e static membership

Entenda protocolos de rebalance, pausas de processamento e como reduzir churn em consumer groups.

## Ambiente

- Tipo: `cluster`
- Compose local: `docker-compose.yml`
- Verificacao: `./verify.sh`

## Subir

```bash
docker compose up -d
```

## Topics esperados

- `rebalance.lab`

## Tarefas

- Subir cluster e criar rebalance.lab.
- Rodar dois consumers no mesmo group.id.
- Adicionar e remover consumers observando assignment.
- Comparar estrategia eager vs cooperative em desenho.
- Definir group.instance.id para membership estatico em servicos stateful.

## Solucao

Preencha `solution.md` com decisoes, trade-offs e evidencias. Nos desafios executaveis, o verificador checa ambiente e topics; nos desafios conceituais, ele valida se a resposta minima foi preenchida.

## Validacao sistemica

Problema que o lab precisa resolver: Validar topic particionado para rebalance e exigir explicacao de eager, cooperative, static membership e assignment.

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

- [ ] Topic rebalance.lab foi criado
- [ ] Dois consumers foram modelados ou executados
- [ ] Assignment de partitions foi observado
- [ ] Static membership foi explicado
- [ ] Cooperative rebalance foi comparado com eager
