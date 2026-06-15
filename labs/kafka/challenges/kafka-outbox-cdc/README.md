# Transactional outbox e CDC

Evite dual write entre banco e Kafka usando outbox transacional e publicacao via CDC ou publisher confiavel.

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

- Desenhar o problema de dual write.
- Modelar tabela outbox_events na mesma transacao do pedido.
- Definir publisher ou CDC que publica no Kafka.
- Definir deduplicacao por event_id.
- Definir limpeza segura da outbox.

## Solucao

Preencha `solution.md` com decisoes, trade-offs e evidencias. Nos desafios executaveis, o verificador checa ambiente e topics; nos desafios conceituais, ele valida se a resposta minima foi preenchida.

## Validacao sistemica

Problema que o lab precisa resolver: Avaliar desenho de transactional outbox com CDC, relay, transacao local e deduplicacao/idempotencia.

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

- [ ] Dual write foi explicado
- [ ] Tabela outbox foi modelada
- [ ] Publisher ou CDC foi escolhido
- [ ] Deduplicacao por event_id foi definida
- [ ] Limpeza da outbox foi planejada
