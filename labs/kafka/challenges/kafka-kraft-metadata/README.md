# KRaft: metadata quorum e controllers

Estude como Kafka moderno gerencia metadata com KRaft, controller quorum e metadata log.

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

- Mapear o papel de controller e broker em KRaft.
- Explicar o metadata log como fonte de verdade de topicos, partitions e configs.
- Comparar operacao com ZooKeeper vs KRaft.
- Definir riscos de quorum pequeno e criterios para numero de controllers.
- Documentar como falha de controller difere de falha de broker de dados.

## Solucao

Preencha `solution.md` com decisoes, trade-offs e evidencias. Nos desafios executaveis, o verificador checa ambiente e topics; nos desafios conceituais, ele valida se a resposta minima foi preenchida.

## Validacao sistemica

Problema que o lab precisa resolver: Avaliar se a solucao explica KRaft como quorum de controllers, metadata log e diferencas contra ZooKeeper.

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

- [ ] Voce explicou o papel do controller quorum
- [ ] Voce explicou metadata log
- [ ] Voce comparou KRaft e ZooKeeper
- [ ] Voce definiu riscos de quorum
- [ ] Voce separou falha de metadata de falha de dados
