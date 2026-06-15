# Security e quotas: TLS, SASL, ACLs e multi-tenancy

Projete acesso seguro para produtores e consumidores com autenticacao, autorizacao e limites por cliente.

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

- Definir principals para order-service e billing-service.
- Definir ACLs minimas para produzir e consumir.
- Definir TLS em transito e SASL para autenticacao.
- Definir quotas por client.id ou user.
- Criar runbook de onboarding de novo time.

## Solucao

Preencha `solution.md` com decisoes, trade-offs e evidencias. Nos desafios executaveis, o verificador checa ambiente e topics; nos desafios conceituais, ele valida se a resposta minima foi preenchida.

## Validacao sistemica

Problema que o lab precisa resolver: Avaliar desenho de TLS/SASL, ACLs, quotas e isolamento multi-tenant.

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

- [ ] Principals foram definidos
- [ ] ACLs minimas foram mapeadas
- [ ] TLS/SASL foram explicados
- [ ] Quotas foram definidas
- [ ] Runbook de onboarding foi criado
