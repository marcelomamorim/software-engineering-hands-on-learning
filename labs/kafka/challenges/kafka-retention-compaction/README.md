# Retention e compaction: replay, tombstones e estado

Compare delete retention e log compaction, incluindo tombstones, changelog topics e recuperacao de estado.

## Ambiente

- Tipo: `cluster`
- Compose local: `docker-compose.yml`
- Verificacao: `./verify.sh`

## Subir

```bash
docker compose up -d
```

## Topics esperados

- `customer.snapshot`

## Tarefas

- Subir cluster Kafka.
- Criar customer.snapshot com cleanup.policy=compact.
- Publicar multiplas versoes para a mesma key.
- Publicar tombstone para uma key.
- Desenhar como um consumer reconstrui estado a partir do topic compactado.

## Solucao

Preencha `solution.md` com decisoes, trade-offs e evidencias. Nos desafios executaveis, o verificador checa ambiente e topics; nos desafios conceituais, ele valida se a resposta minima foi preenchida.

## Validacao sistemica

Problema que o lab precisa resolver: Validar cleanup.policy=compact, produzir snapshots por key e exigir tombstone, retention e replay na solucao.

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

- [ ] Topic compactado foi criado ou especificado
- [ ] Multiplas versoes da mesma key foram planejadas
- [ ] Tombstone foi explicado
- [ ] Delete retention foi comparado com compaction
- [ ] Replay de estado foi documentado
