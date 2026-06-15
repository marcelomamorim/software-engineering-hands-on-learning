window.STUDIES_DATA = {
  "id": "kafka-study-guide",
  "title": "Estudos Kafka: mapa mental antes dos desafios",
  "summary": "Assista a uma animacao longa e estude os conceitos que aparecem nos 18 desafios Kafka antes de subir o ambiente local.",
  "concepts": [
    "Broker como processo/servidor: VM, maquina fisica, container ou pod",
    "Bootstrap servers, listeners, advertised.listeners e IPs de exemplo",
    "Fluxo real de pedidos: OrderCreated, PaymentApproved, StockReserved, OrderShipped",
    "Topic, partition, offset e log distribuido",
    "Record batch, segmentos, indices e page cache",
    "Producer: acks, retries, idempotencia e ordering",
    "Replication: leader, follower, ISR e high watermark",
    "ISR em detalhe: RF, replicas sincronas, min.insync.replicas e falhas",
    "KRaft: controller quorum e metadata log",
    "Consumer groups, commits, lag e rebalance",
    "Partition key, hot partition e paralelismo",
    "Retention, compaction, tombstone e replay",
    "Schema evolution e contratos de evento",
    "Transactions, EOS, DLQ, outbox e stream processing",
    "Performance, security, quotas e observability"
  ],
  "theoryTitle": "Mapa mental Kafka antes dos labs",
  "theorySummary": "Esta etapa e somente de estudo. A animacao percorre Kafka como infraestrutura real e como sistema distribuido: brokers com IPs/portas, fluxo de pedidos, log particionado, storage interno, producer reliability, ISR, replication, KRaft, consumer groups, ordering, retention/compaction, schema evolution, transactions, DLQ, outbox, streams, performance, seguranca e observabilidade.",
  "goals": [
    "Construir uma visao de ponta a ponta do caminho de um record no Kafka.",
    "Explicar Kafka tambem em termos de infraestrutura: servidor, processo, IP, porta, disco, rede e configuracao.",
    "Explicar a ordem real dos acontecimentos em um fluxo de pedidos e em uma falha de broker.",
    "Entender quais garantias pertencem ao producer, ao broker, ao consumer e a aplicacao.",
    "Chegar aos labs sabendo quais comandos, arquivos e metricas observar."
  ],
  "deepDive": [
    "Infraestrutura: broker nao e uma entidade abstrata. E um processo de servidor que escuta em uma porta, anuncia endereco para clientes, grava logs em disco e participa de replicacao. Em Kubernetes, um broker pode estar em um pod; em VM, em um host; em bare metal, em uma maquina fisica. Em todos os casos, disco e rede continuam determinando limites reais.",
    "Bootstrap e listeners: clients comecam por bootstrap.servers, por exemplo kafka.prod:9092. O broker responde metadata com os endpoints anunciados em advertised.listeners, por exemplo broker-1.kafka.prod:9092 ou 10.0.10.11:9092. Se esse endereco estiver errado, o client ate conecta no bootstrap, mas falha ao falar com o leader real.",
    "Contexto de pedidos: checkout-api publica OrderCreated com key=ORD-9001. payment-service consome e publica PaymentApproved com a mesma key. stock-service publica StockReserved e shipping-service publica OrderShipped. Como a key e a mesma, esses eventos tendem a cair na mesma partition e manter ordem relativa do pedido.",
    "Topic, partition e offset: um topic e dividido em partitions; cada partition e um log ordenado com offsets monotonicamente crescentes. O offset identifica uma posicao de leitura dentro daquela partition.",
    "Ordem em system design: Kafka nao da ordem global barata. O desenho correto geralmente define ordem por entidade. Para pedidos, order_id e a entidade causal. Pedidos diferentes podem processar em paralelo; o mesmo pedido deve manter sequencia.",
    "Producer e routing: o producer serializa records, agrupa em batches, escolhe a partition por key/hash ou estrategia customizada e aguarda ACK de acordo com a configuracao.",
    "Storage interno: brokers gravam batches em segmentos append-only. Indices esparsos ajudam busca por offset e timestamp; page cache reduz custo de leitura.",
    "ISR em detalhe: ISR significa In-Sync Replicas. Se um topic tem replication factor 3, uma partition pode ter replicas em broker-1, broker-2 e broker-3. O leader recebe writes; followers buscam do leader. Enquanto acompanham dentro do limite configurado, ficam no ISR. Se atrasam ou caem, saem do ISR.",
    "acks=all e min.insync.replicas: com RF=3 e min.insync.replicas=2, o producer com acks=all so recebe sucesso se pelo menos leader + uma replica sincronizada confirmarem. Se o ISR cair para 1, Kafka deve rejeitar writes para nao prometer durabilidade falsa.",
    "High watermark: e o ponto ate onde o log e considerado seguro para leitura por consumers. Ele evita que um consumer leia um record que estava apenas no leader e poderia desaparecer se o leader falhasse antes da replicacao.",
    "Replication e visibilidade: cada partition tem leader e followers. O ISR representa replicas sincronizadas; consumers leem ate o high watermark para evitar dados nao confirmados.",
    "KRaft: controllers formam um quorum que replica metadata em log proprio. Essa metadata define topics, configs, leaders e estado do cluster.",
    "Consumers e offsets: consumer groups recebem assignments de partitions. Commit de offset grava progresso; reprocessamento e reset mudam a posicao do grupo.",
    "Rebalance: mudancas no grupo redistribuem partitions. Protocolos eager, cooperative e static membership tentam reduzir pausas e churn.",
    "Keys e ordering: Kafka garante ordem dentro de uma partition. A key precisa refletir a entidade que exige ordenacao, mas pode causar hot partition.",
    "Falha de broker em ordem: se broker-1 liderava P0 e cai, o controller detecta a falha, escolhe uma replica elegivel como novo leader, atualiza metadata, producers fazem refresh e consumers passam a buscar do novo leader. Durante isso pode haver aumento de latencia, erros transitorios e rebalance.",
    "Retention e compaction: delete retention expira segmentos por tempo/tamanho; compaction preserva o ultimo valor por key e usa tombstones para exclusao logica.",
    "Schemas e contratos: eventos sao APIs entre times. Compatibilidade backward/forward, campos opcionais e semantica clara evitam quebrar consumers.",
    "Transactions/EOS: transacoes atomizam writes e offsets dentro do Kafka. Efeitos externos ainda exigem outbox, idempotencia ou deduplicacao.",
    "Operacao: performance nasce de batching, compression, fetch e partitions; seguranca vem de TLS/SASL/ACLs/quotas; incidentes pedem runbook com lag, ISR, disco e capacidade."
  ],
  "pitfalls": [
    "Chamar Kafka de fila e perder a ideia de log retido/reprocessavel.",
    "Falar de broker, topic e partition como se fossem a mesma coisa.",
    "Ignorar IPs/listeners e depois nao entender por que clients conectam no bootstrap mas falham no leader.",
    "Confundir offset commit com remocao ou confirmacao global da mensagem.",
    "Achar que acks=all sozinho resolve durabilidade sem ISR/min.insync.replicas.",
    "Dizer que ISR e replication factor. RF e quantidade configurada de replicas; ISR e subconjunto atualmente sincronizado.",
    "Assumir exactly-once para banco/API externa porque Kafka tem transactions.",
    "Medir lag agregado e ignorar skew por partition."
  ],
  "takeaways": [
    "Voce sabe explicar como um record atravessa producer, broker, log, replica e consumer.",
    "Voce sabe desenhar uma topologia Kafka real com IPs, portas, brokers, clients e discos.",
    "Voce sabe explicar ISR, high watermark e min.insync.replicas sem decorar frase pronta.",
    "Voce sabe justificar ordenacao por order_id e tolerancia a falha em linguagem de system design.",
    "Voce sabe onde cada desafio Kafka se encaixa no funcionamento interno.",
    "Voce sabe quais links oficiais consultar quando um conceito aparecer no lab."
  ],
  "diagram": [
    [
      "order-api 10.0.20.50",
      "bootstrap kafka.prod:9092"
    ],
    [
      "bootstrap kafka.prod:9092",
      "broker-1 10.0.10.11:9092"
    ],
    [
      "bootstrap kafka.prod:9092",
      "broker-2 10.0.10.12:9092"
    ],
    [
      "bootstrap kafka.prod:9092",
      "broker-3 10.0.10.13:9092"
    ],
    [
      "Producer",
      "Partitioner"
    ],
    [
      "Partitioner",
      "Leader partition"
    ],
    [
      "Leader partition",
      "Segment files"
    ],
    [
      "Leader partition",
      "Follower replicas"
    ],
    [
      "Follower replicas",
      "ISR"
    ],
    [
      "ISR",
      "min.insync.replicas"
    ],
    [
      "Follower replicas",
      "High watermark"
    ],
    [
      "High watermark",
      "Consumer fetch"
    ],
    [
      "Consumer fetch",
      "Offset commit"
    ],
    [
      "Controller quorum",
      "Metadata log"
    ]
  ],
  "references": [
    [
      "Conceito exato: Kafka concepts and terms",
      "https://kafka.apache.org/documentation/#intro_concepts_and_terms"
    ],
    [
      "Conceito exato: Kafka design",
      "https://kafka.apache.org/documentation/#design"
    ],
    [
      "Conceito exato: Kafka implementation",
      "https://kafka.apache.org/documentation/#implementation"
    ],
    [
      "Conceito exato: Producer API",
      "https://kafka.apache.org/documentation/#theproducer"
    ],
    [
      "Conceito exato: Consumer API",
      "https://kafka.apache.org/documentation/#theconsumer"
    ],
    [
      "Conceito exato: Message delivery semantics",
      "https://kafka.apache.org/documentation/#semantics"
    ],
    [
      "Conceito exato: Kafka configuration",
      "https://kafka.apache.org/documentation/#configuration"
    ],
    [
      "Conceito exato: Kafka security",
      "https://kafka.apache.org/documentation/#security"
    ],
    [
      "Conceito exato: Kafka Streams documentation",
      "https://kafka.apache.org/documentation/streams/"
    ],
    [
      "KIP-98: exactly-once delivery and transactional messaging",
      "https://cwiki.apache.org/confluence/display/KAFKA/KIP-98%2B-%2BExactly%2BOnce%2BDelivery%2Band%2BTransactional%2BMessaging"
    ],
    [
      "KIP-345: static membership protocol",
      "https://cwiki.apache.org/confluence/display/KAFKA/KIP-345%3A%2BIntroduce%2Bstatic%2Bmembership%2Bprotocol%2Bto%2Breduce%2Bconsumer%2Brebalances"
    ],
    [
      "KIP-429: incremental cooperative rebalance",
      "https://cwiki.apache.org/confluence/display/KAFKA/KIP-429%3A+Kafka+Consumer+Incremental+Rebalance+Protocol"
    ],
    [
      "KIP-500: KRaft metadata quorum",
      "https://cwiki.apache.org/confluence/display/KAFKA/KIP-500%3A%2BReplace%2BZooKeeper%2Bwith%2Ba%2BSelf-Managed%2BMetadata%2BQuorum"
    ],
    [
      "KIP-848: next generation consumer rebalance protocol",
      "https://cwiki.apache.org/confluence/x/HhD1D"
    ],
    [
      "Artigo tecnico: Kafka transactions na pratica",
      "https://strimzi.io/blog/2023/05/03/kafka-transactions/"
    ],
    [
      "Artigo tecnico: high watermark offset",
      "https://blog.2minutestreaming.com/p/kafka-high-watermark-offset"
    ],
    [
      "Artigo tecnico: partition key",
      "https://www.confluent.io/learn/kafka-partition-key/"
    ]
  ],
  "video": "./videos/kafka-study-guide.mp4"
};
