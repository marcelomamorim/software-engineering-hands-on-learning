# Topic design: naming, partitions, RF e ownership

Desenhe topicos como contratos operacionais: nome, dono, retention, partitions, replication factor e SLO.

## Ambiente

- Tipo: `cluster`
- Compose local: `docker-compose.yml`
- Verificacao: `./verify.sh`

## Subir

```bash
docker compose up -d
```

## Topics esperados

- `catalog.orders.v1`

## Tarefas

- Definir padrao de nomes para eventos de dominio.
- Criar catalog.orders.v1 com 12 partitions e RF 3.
- Definir owner, schema, retention, criticidade e consumidores esperados.
- Comparar custo de partitions demais vs partitions de menos.
- Definir processo para evoluir topicos sem quebrar consumidores.

## Solucao

Preencha `solution.md` com decisoes, trade-offs e evidencias. Nos desafios executaveis, o verificador checa ambiente e topics; nos desafios conceituais, ele valida se a resposta minima foi preenchida.

## Validacao sistemica

Problema que o lab precisa resolver: Validar naming/versionamento, partitions, RF e decisoes de ownership, retention e replication.

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

- [ ] Padrao de naming foi definido
- [ ] Topic catalog.orders.v1 foi criado ou especificado
- [ ] Owner e consumidores foram documentados
- [ ] Retention foi justificada
- [ ] Partition count foi defendido
