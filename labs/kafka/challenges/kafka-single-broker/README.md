# Kafka local: producer, consumer e offsets

Suba um broker local, rode producer/consumer em Python e observe offsets, keys, commits manuais e reprocessamento.

## Ambiente

- Tipo: `single`
- Compose local: `docker-compose.yml`
- Verificacao: `./verify.sh`

## Subir

```bash
docker compose up -d
```

## Topics esperados

- `orders.events`

## Tarefas

- Subir Kafka local usando o botao do ambiente.
- Criar um evento OrderCreated no producer Python e publicar no topic orders.events.
- Rodar o consumer Python com enable.auto.commit=false.
- Parar o consumer durante o processamento e observar se a mensagem pode voltar.
- Alterar GROUP_ID para outro valor e comprovar que eventos antigos podem ser relidos.

## Solucao

Preencha `solution.md` com decisoes, trade-offs e evidencias. Nos desafios executaveis, o verificador checa ambiente e topics; nos desafios conceituais, ele valida se a resposta minima foi preenchida.

## Validacao sistemica

Problema que o lab precisa resolver: Publicar e consumir um evento real em orders.events, provar round-trip, exigir decisao sobre commit manual, group.id e idempotencia.

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

- [ ] Ambiente Kafka local esta rodando
- [ ] Producer Python enviou eventos em orders.events
- [ ] Consumer Python processou e commitou offsets manualmente
- [ ] Voce alterou group.id e reprocessou eventos
- [ ] Voce documentou por que processamento deve ser idempotente
