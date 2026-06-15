# Schema evolution: contratos de evento e compatibilidade

Modele contratos de evento que evoluem sem quebrar consumidores independentes.

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

- Definir contrato inicial de OrderCreated.
- Adicionar campos opcionais e obrigatorios comparando impacto.
- Definir regras de compatibilidade para produtores e consumidores.
- Criar matriz de mudancas seguras e quebradoras.
- Definir processo de deprecacao de campos.

## Solucao

Preencha `solution.md` com decisoes, trade-offs e evidencias. Nos desafios executaveis, o verificador checa ambiente e topics; nos desafios conceituais, ele valida se a resposta minima foi preenchida.

## Validacao sistemica

Problema que o lab precisa resolver: Avaliar contrato de evento com compatibilidade backward/forward, campos opcionais e versionamento.

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

- [ ] Contrato inicial foi definido
- [ ] Mudancas backward/forward foram classificadas
- [ ] Campos obrigatorios novos foram discutidos
- [ ] Processo de deprecacao foi documentado
- [ ] Validacao de schema foi prevista
