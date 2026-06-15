# Stream processing: state store, joins e changelog

Projete uma topologia de processamento com agregacoes, state store, joins e changelog topics.

## Ambiente

- Tipo: `none`
- Compose local: `docker-compose.yml`
- Verificacao: `./verify.sh`

## Subir

```bash
docker compose up -d
```

## Topics esperados

- Este desafio e conceitual; nao exige topic obrigatorio.

## Tarefas

- Definir streams de entrada: order.events e payment.events.
- Modelar agregacao por customer_id em janela de 1 hora.
- Definir state store local e changelog topic.
- Desenhar restore de estado apos restart.
- Comparar stream processing com batch job periodico.

## Solucao

Preencha `solution.md` com decisoes, trade-offs e evidencias. Nos desafios executaveis, o verificador checa ambiente e topics; nos desafios conceituais, ele valida se a resposta minima foi preenchida.

## Validacao sistemica

Problema que o lab precisa resolver: Avaliar state store, changelog, joins, janelas e reprocessamento em processamento de streams.

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

- [ ] Streams de entrada foram definidos
- [ ] Agregacao por key foi desenhada
- [ ] State store foi modelado
- [ ] Changelog topic foi explicado
- [ ] Restore de estado foi documentado
