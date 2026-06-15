# Software Engineering Hands-on Learning

Projeto pessoal para estudar engenharia de software de forma pratica, com foco atual em uma trilha profunda de Apache Kafka.

O repositorio combina estudo teorico, visualizacoes locais, videos explicativos, laboratorios Docker e verificadores sistemicos para treinar raciocinio de system design com evidencias observaveis.

## O que existe agora

- Pagina estatica de estudos publicada via GitHub Pages.
- Trilha Kafka com estudo teorico antes dos desafios.
- 18 desafios Kafka com README, `docker-compose.yml`, `verify.sh`, `systemic-verify.sh` e `solution.md`.
- Videos Remotion locais para explicar os conceitos e desafios.
- Validacao sistemica: os scripts tentam observar Kafka em execucao, produzir/consumir mensagens, checar topics, ISR, configs, offsets ou evidencias arquiteturais.

## Estrutura

```text
.
|-- app/
|   |-- kafka-challenges.js
|   `-- public/videos/
|-- docs/
|   |-- index.html
|   |-- kafka.html
|   |-- kafka-challenges.html
|   `-- kafka/
|-- labs/
|   `-- kafka/
|       |-- challenges/
|       |-- docker-compose.yml
|       `-- docker-compose.cluster.yml
|-- scripts/
|-- src/remotion/
`-- .github/workflows/deploy-studies.yml
```

## Rodar localmente

Instale dependencias:

```bash
npm ci
```

Suba o painel local:

```bash
npm run app
```

Acesse:

```text
http://localhost:4173
```

## Site estatico de estudos

Gerar o artefato usado pelo GitHub Pages:

```bash
npm run build:studies
```

O build gera:

```text
dist/studies
```

O workflow `.github/workflows/deploy-studies.yml` roda `npm ci`, valida TypeScript, executa `npm run build:studies` e publica `dist/studies` no GitHub Pages.

## Labs Kafka

Cada desafio fica em:

```text
labs/kafka/challenges/<id-do-desafio>
```

Exemplo:

```bash
cd labs/kafka/challenges/kafka-single-broker
docker compose up -d
./verify.sh
```

Dentro de cada lab:

```text
README.md
docker-compose.yml
verify.sh
systemic-verify.sh
solution.md
```

O `verify.sh` carrega o verificador do proprio lab:

```bash
source "$SCRIPT_DIR/systemic-verify.sh" "<id-do-desafio>"
```

## Remotion

Abrir o studio:

```bash
npm run remotion:studio
```

Renderizar videos dos desafios:

```bash
npm run remotion:render:challenges
```

Renderizar o video longo de estudo Kafka:

```bash
npm run remotion:render:kafka-study
```

## Validacoes

Checar TypeScript:

```bash
npx tsc --noEmit
```

Checar build do site:

```bash
npm run build:studies
```

## Licenca

MIT.
