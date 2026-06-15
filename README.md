# Software Engineering Hands-on Learning

Projeto pessoal para estudar engenharia de software de forma pratica, com foco inicial profundo em:

- System Design
- Apache Kafka
- DynamoDB
- SQS

A proposta deste repositorio e aprender construindo. Cada modulo combina leitura orientada, desenho de arquitetura, implementacao, experimentos, perguntas de revisao e pequenas decisoes tecnicas documentadas.

## Como usar

1. Comece por [docs/curriculo.md](docs/curriculo.md).
2. Estude System Design em [docs/system-design/README.md](docs/system-design/README.md).
3. Use o workbook de referencia em [docs/system-design/livro-referencia.md](docs/system-design/livro-referencia.md).
4. Rode os laboratorios de Kafka em [docs/kafka/README.md](docs/kafka/README.md).
5. Estude DynamoDB em [docs/dynamodb/README.md](docs/dynamodb/README.md).
6. Estude SQS em [docs/sqs/README.md](docs/sqs/README.md).
7. Use o projeto integrador em [projects/event-driven-marketplace/README.md](projects/event-driven-marketplace/README.md) para juntar os temas.

## Estrutura

```text
.
|-- docs/
|   |-- curriculo.md
|   |-- dynamodb/
|   |-- kafka/
|   |-- sqs/
|   |-- system-design/
|   `-- templates/
|-- labs/
|   |-- aws/
|   `-- kafka/
`-- projects/
    `-- event-driven-marketplace/
```

## Filosofia

- Entender fundamentos antes de decorar ferramentas.
- Desenhar sistemas e depois validar as hipoteses com codigo.
- Escrever decisoes tecnicas para treinar julgamento.
- Medir comportamento: latencia, throughput, falhas, consumo, retencao e consistencia.
- Repetir os mesmos problemas em camadas cada vez mais realistas.

## Proximo passo recomendado

Abra o painel local de desafios:

```bash
npm run app
```

Depois acesse:

```text
http://localhost:4173
```

O painel permite subir ambientes locais, acompanhar checklist, salvar anotacoes e avaliar se o desafio foi concluido.

## Animacao dos desafios

Foi criada uma composicao Remotion para explicar visualmente como os desafios funcionam:

```bash
npm run remotion:studio
```

Renderizar o video:

```bash
npm run remotion:render
```

Renderizar um video explicativo por desafio para o painel:

```bash
npm run remotion:render:challenges
```

Saida gerada:

```text
out/challenge-overview.mp4
app/public/videos/*.mp4
```

Para DynamoDB e SQS local:

```bash
cd labs/aws
docker compose up -d
```

Rode o laboratorio Kafka local:

```bash
cd labs/kafka
docker compose up -d
```

Depois siga o roteiro em [labs/kafka/README.md](labs/kafka/README.md).

Para estudar Kafka por dentro, use tambem:

```bash
cd labs/kafka
docker compose -f docker-compose.cluster.yml up -d
```

Depois siga [labs/kafka/internals.md](labs/kafka/internals.md).
