(function () {
  const data = window.STUDIES_DATA;

  const sections = [
    ["visao", "Visao geral"],
    ["video", "Video e mapa"],
    ["linha-do-tempo", "Linha do tempo"],
    ["definicoes", "Definicoes"],
    ["etapas-tecnicas", "Etapas tecnicas"],
    ["glossario", "Glossario"],
    ["system-design", "System design"],
    ["referencias", "Referencias"],
  ];

  const lifecycleSteps = [
    [
      "Evento de dominio",
      "A aplicacao registra um fato imutavel, como OrderCreated, com event_id, order_id, timestamp, schema_version e payload de negocio.",
    ],
    [
      "Producer record",
      "O producer recebe topic, key, value e headers. A key order_id sera usada para preservar ordem por pedido.",
    ],
    [
      "Bootstrap e metadata",
      "O client conecta em kafka.prod:9092, descobre brokers, leaders e endpoints anunciados por advertised.listeners.",
    ],
    [
      "Escolha da partition",
      "O partitioner aplica hash na key e escolhe uma partition, por exemplo orders.events-4.",
    ],
    [
      "Batch e compressao",
      "Records da mesma topic-partition sao agrupados em batches para reduzir custo de rede e escrita.",
    ],
    [
      "Broker leader",
      "O request vai ao broker que lidera aquela partition, por exemplo broker-1 em 10.0.10.11:9092.",
    ],
    [
      "Append no log",
      "O broker valida a request, anexa o batch ao log append-only, atribui offsets e escreve segmentos e indices.",
    ],
    [
      "Replicacao",
      "Followers copiam dados do leader. Replication factor define quantas copias devem existir.",
    ],
    [
      "ISR e acks",
      "In-Sync Replicas indica quem esta em dia. Com acks=all e min.insync.replicas=2, o sucesso exige redundancia minima.",
    ],
    [
      "High watermark",
      "Consumers so leem ate o ponto considerado seguro, evitando ler records que poderiam sumir apos uma troca de leader.",
    ],
    [
      "Consumer fetch",
      "Consumers de um group recebem partitions, buscam records e processam o payload.",
    ],
    [
      "Offset commit",
      "O commit grava progresso em __consumer_offsets. Ele nao apaga a mensagem e nao garante efeito externo exatamente uma vez.",
    ],
  ];

  const documentedDefinitions = [
    {
      term: "Evento",
      docs: "https://kafka.apache.org/documentation/#intro_concepts_and_terms",
      definition:
        "Kafka trata eventos como fatos registrados sobre algo que aconteceu no mundo ou no negocio.",
      example:
        "OrderCreated informa que o pedido ORD-9001 foi criado; nao e um comando pedindo para criar.",
      design:
        "Eventos precisam de identidade, timestamp, entidade causal e contrato estavel, porque viram API assincrona entre sistemas.",
    },
    {
      term: "Record",
      docs: "https://kafka.apache.org/documentation/#theproducer",
      definition:
        "Record e a unidade publicada pelo producer em um topic, carregando key, value, timestamp e metadados.",
      example:
        "topic=orders.events, key=ORD-9001, value=OrderCreated.",
      design:
        "A key define particionamento e, na pratica, define qual ordem voce consegue preservar.",
    },
    {
      term: "Producer",
      docs: "https://kafka.apache.org/documentation/#theproducer",
      definition:
        "Producer e o client Kafka responsavel por publicar records em topics.",
      example:
        "A order-api publica OrderCreated quando o checkout conclui a criacao do pedido.",
      design:
        "Producer reliability envolve acks, retries, idempotencia, timeouts, batching e observabilidade.",
    },
    {
      term: "Broker",
      docs: "https://kafka.apache.org/documentation/#intro_concepts_and_terms",
      definition:
        "Broker e um servidor Kafka dentro do cluster; ele armazena partitions e atende clients.",
      example:
        "broker-1 em 10.0.10.11:9092 pode liderar a partition 4 de orders.events.",
      design:
        "Broker e infraestrutura stateful: disco persistente, rede, page cache, listeners e metricas importam.",
    },
    {
      term: "Topic",
      docs: "https://kafka.apache.org/documentation/#intro_concepts_and_terms",
      definition:
        "Topic e a categoria ou feed nomeado para onde records sao publicados.",
      example:
        "orders.events agrupa eventos do dominio de pedidos.",
      design:
        "Topic precisa ter dono, contrato, retencao, politica de compatibilidade e consumidores esperados.",
    },
    {
      term: "Partition",
      docs: "https://kafka.apache.org/documentation/#intro_concepts_and_terms",
      definition:
        "Partition e um log ordenado dentro de um topic; e a unidade de ordem, paralelismo, replicacao e armazenamento.",
      example:
        "ORD-9001 pode cair em orders.events-4, preservando a ordem dos eventos daquele pedido.",
      design:
        "Kafka garante ordem dentro da partition, nao ordem global barata no topic inteiro.",
    },
    {
      term: "Offset",
      docs: "https://kafka.apache.org/documentation/#theconsumer",
      definition:
        "Offset e a posicao de um record dentro de uma partition.",
      example:
        "OrderCreated pode estar em orders.events-4 offset 128.",
      design:
        "Offset e posicao no log; nao prova que um efeito externo foi concluido exatamente uma vez.",
    },
    {
      term: "Leader e follower",
      docs: "https://kafka.apache.org/documentation/#replication",
      definition:
        "Cada partition tem uma replica leader; as demais replicas seguem o leader.",
      example:
        "broker-1 lidera, broker-2 e broker-3 replicam.",
      design:
        "Distribuicao de leaders afeta carga real; followers permitem continuidade apos falha.",
    },
    {
      term: "ISR",
      docs: "https://kafka.apache.org/documentation/#replication",
      definition:
        "ISR, In-Sync Replicas, e o conjunto de replicas sincronizadas com o leader.",
      example:
        "RF=3 pode ter ISR=2 quando broker-3 esta atrasado.",
      design:
        "RF e configuracao desejada; ISR e a redundancia real naquele momento.",
    },
    {
      term: "acks",
      docs: "https://kafka.apache.org/documentation/#producerconfigs",
      definition:
        "acks controla quantas confirmacoes o producer espera antes de considerar a escrita bem-sucedida.",
      example:
        "acks=all com min.insync.replicas=2 exige confirmacao de replicas sincronizadas suficientes.",
      design:
        "Para eventos criticos, falhar durante degradacao pode ser melhor que confirmar dado sem redundancia.",
    },
    {
      term: "High watermark",
      docs: "https://kafka.apache.org/documentation/#replication",
      definition:
        "High watermark marca ate onde o log foi replicado de forma segura para leitura.",
      example:
        "Se o leader chegou ao offset 130 mas replicas chegaram ao 129, consumers leem ate 129.",
      design:
        "High watermark evita que consumidores tomem decisoes com base em dados que podem sumir apos leader election.",
    },
    {
      term: "Consumer group",
      docs: "https://kafka.apache.org/documentation/#theconsumer",
      definition:
        "Consumer group permite que consumers dividam partitions de um topic entre membros do mesmo grupo.",
      example:
        "Tres instancias do payment-service dividem doze partitions de orders.events.",
      design:
        "Mais consumers que partitions nao aumenta paralelismo; hot partitions continuam sendo gargalo.",
    },
    {
      term: "Retention",
      docs: "https://kafka.apache.org/documentation/#design",
      definition:
        "Kafka retem records por politicas de tempo, tamanho ou compactacao; ler nao remove automaticamente.",
      example:
        "Um evento OrderCreated pode ser relido para replay enquanto estiver dentro da retencao.",
      design:
        "Retention longa ajuda auditoria e reprocessamento, mas aumenta custo de disco.",
    },
  ];

  const technicalStages = [
    {
      title: "1. Evento de dominio nasce na aplicacao",
      summary:
        "A mensagem comeca antes do Kafka: a aplicacao decide que um fato de negocio aconteceu. Em pedidos, OrderCreated deve representar um fato imutavel, nao um comando.",
      internals: [
        "O evento deve ter identidade propria, como event_id, para deduplicacao e rastreabilidade.",
        "A entidade causal, como order_id, precisa aparecer explicitamente porque ela normalmente vira a partition key.",
        "Headers podem carregar traceparent, correlation_id, producer, tenant e schema id sem poluir o payload de negocio.",
        "O timestamp pode representar tempo do evento ou tempo de append, e essa escolha afeta ordenacao analitica e investigacao de incidentes.",
      ],
      configs: [
        "schema_version no payload ou schema id no header.",
        "event_id como chave de idempotencia de consumidor.",
        "traceparent/correlation_id para observabilidade distribuida.",
      ],
      design:
        "Modele eventos como API publica entre sistemas. Se mudar significado de campo sem contrato, voce quebra consumidores invisiveis.",
      docs: "https://kafka.apache.org/documentation/#intro_concepts_and_terms",
    },
    {
      title: "2. Producer transforma evento em record Kafka",
      summary:
        "O producer recebe topic, key, value, headers e timestamp, serializa o payload e coloca o record no acumulador interno por topic-partition.",
      internals: [
        "O producer mantem metadata cache com leaders e partitions conhecidas.",
        "Records nao sao enviados necessariamente um a um; eles entram em batches por topic-partition.",
        "Serializacao acontece antes do envio, entao erro de schema ou payload deve falhar ainda no produtor.",
        "O producer controla requests em voo, retries, timeouts e sequenciamento para cada partition.",
      ],
      configs: [
        "bootstrap.servers",
        "key.serializer e value.serializer",
        "client.id",
        "enable.idempotence",
        "delivery.timeout.ms e request.timeout.ms",
      ],
      design:
        "Producer reliability nao e so retry. Retry sem idempotencia pode duplicar; timeout curto demais cria falso erro; timeout longo demais segura memoria e mascara incidentes.",
      docs: "https://kafka.apache.org/documentation/#theproducer",
    },
    {
      title: "3. Bootstrap descobre metadata real do cluster",
      summary:
        "bootstrap.servers e apenas a porta de entrada. O producer conecta em um broker e recebe metadata com leaders, partitions e endpoints anunciados.",
      internals: [
        "O client nao precisa conhecer todos os brokers de antemao.",
        "Depois de obter metadata, o producer fala diretamente com o broker leader da partition alvo.",
        "advertised.listeners define quais enderecos os clients devem usar depois do bootstrap.",
        "Metadata fica em cache e e atualizada quando ocorre erro, mudanca de leader ou expiracao.",
      ],
      configs: [
        "bootstrap.servers=kafka.prod:9092",
        "listeners",
        "advertised.listeners",
        "metadata.max.age.ms",
      ],
      design:
        "Muitos incidentes locais e em Kubernetes parecem problema de Kafka, mas sao problema de endereco anunciado: o client conecta no bootstrap e depois recebe um host que nao consegue alcancar.",
      docs: "https://kafka.apache.org/documentation/#configuration",
    },
    {
      title: "4. Partitioner decide a partition",
      summary:
        "Com key, o producer usa particionamento deterministico. Para pedidos, key=order_id preserva ordem relativa dos eventos daquele pedido.",
      internals: [
        "A partition e escolhida antes do envio ao broker.",
        "Sem key, o producer distribui records para balancear carga, mas nao preserva ordem por entidade.",
        "Com key, mudancas na quantidade de partitions podem mudar o destino futuro de uma mesma key.",
        "A garantia de ordem do Kafka vale dentro de uma partition, nao no topic inteiro.",
      ],
      configs: [
        "partitioner.class",
        "partition count do topic",
        "key serializer consistente",
      ],
      design:
        "A pergunta central e: qual entidade precisa de ordem? Pedido, cliente, conta, dispositivo ou tenant? A resposta define a key e tambem o limite de paralelismo.",
      docs: "https://kafka.apache.org/documentation/#intro_concepts_and_terms",
    },
    {
      title: "5. Batching, linger e compressao",
      summary:
        "Kafka ganha throughput agrupando records. O producer acumula batches por topic-partition e pode comprimir o batch inteiro.",
      internals: [
        "batch.size define o tamanho alvo do batch por partition.",
        "linger.ms permite esperar alguns milissegundos para juntar mais records.",
        "compression.type reduz bytes em rede e disco, mas consome CPU.",
        "buffer.memory limita memoria total usada pelos acumuladores do producer.",
      ],
      configs: [
        "batch.size",
        "linger.ms",
        "compression.type=zstd/lz4/snappy/gzip",
        "buffer.memory",
      ],
      design:
        "Baixa latencia e alto throughput puxam em direcoes diferentes. Para checkout critico, voce pode aceitar batches menores; para analytics, batches maiores reduzem custo.",
      docs: "https://kafka.apache.org/documentation/#producerconfigs",
    },
    {
      title: "6. Request vai ao broker leader",
      summary:
        "Cada partition tem um leader. O producer envia o produce request para o broker que lidera a partition escolhida.",
      internals: [
        "O leader recebe writes e atribui offsets.",
        "Followers nao recebem writes diretamente do producer para aquela partition.",
        "Se o leader muda, o producer recebe erro transitorio, atualiza metadata e tenta novamente.",
        "O balanceamento de leaders determina boa parte da distribuicao de carga no cluster.",
      ],
      configs: [
        "leader election",
        "replica assignment",
        "request.timeout.ms",
        "retry.backoff.ms",
      ],
      design:
        "Nao basta distribuir replicas. Se um broker lidera partitions demais, ele concentra CPU, rede, page cache e latencia de request.",
      docs: "https://kafka.apache.org/documentation/#replication",
    },
    {
      title: "7. Broker faz append no log e atribui offset",
      summary:
        "O broker valida a request e anexa o batch ao fim do log da partition. O offset e uma posicao monotonicamente crescente dentro daquela partition.",
      internals: [
        "Kafka grava segmentos .log e indices auxiliares .index e .timeindex.",
        "Append-only favorece escrita sequencial e uso eficiente do page cache do sistema operacional.",
        "O broker nao apaga record quando um consumer le; retencao e compaction sao processos independentes.",
        "O offset fica associado a partition; nao existe offset global do topic.",
      ],
      configs: [
        "log.dirs",
        "log.segment.bytes",
        "log.index.interval.bytes",
        "retention.ms e retention.bytes",
      ],
      design:
        "Disco nao e detalhe. Tipo de volume, throughput, IOPS, page cache e espaco livre afetam diretamente latencia e estabilidade.",
      docs: "https://kafka.apache.org/documentation/#implementation",
    },
    {
      title: "8. Followers replicam do leader",
      summary:
        "Replicas followers buscam dados do leader. Replication factor define quantas copias devem existir para cada partition.",
      internals: [
        "Followers usam um mecanismo de fetch parecido com consumidores internos.",
        "Replicacao atrasada diminui o ISR e pode bloquear writes com acks=all.",
        "Replica em outra zona aumenta tolerancia a falha, mas tambem latencia e custo de rede.",
        "Quando um broker volta, ele precisa copiar o atraso antes de voltar ao ISR.",
      ],
      configs: [
        "replication.factor",
        "replica.lag.time.max.ms",
        "min.insync.replicas",
      ],
      design:
        "RF=3 nao significa tres copias sempre atualizadas. Em incidentes, olhe ISR, under-replicated partitions e velocidade de catch-up.",
      docs: "https://kafka.apache.org/documentation/#replication",
    },
    {
      title: "9. ISR, acks e durabilidade real",
      summary:
        "ISR e o conjunto de replicas sincronizadas. Com acks=all, o producer so recebe sucesso quando a condicao de replicas in-sync e satisfeita.",
      internals: [
        "RF e configuracao; ISR e estado atual.",
        "Com RF=3 e min.insync.replicas=2, o cluster aceita writes se pelo menos duas replicas estao em sincronia.",
        "Se ISR cair para 1, writes com acks=all devem falhar para evitar promessa falsa de durabilidade.",
        "acks=1 confirma apenas o leader; se ele falhar antes de replicar, pode haver perda.",
      ],
      configs: [
        "acks=all",
        "min.insync.replicas=2",
        "unclean.leader.election.enable=false",
        "enable.idempotence=true",
      ],
      design:
        "Para pedido e pagamento, durabilidade geralmente vale mais que aceitar write durante degradacao severa. Falhar rapido pode ser mais correto do que confirmar dado fragil.",
      docs: "https://kafka.apache.org/documentation/#semantics",
    },
    {
      title: "10. High watermark controla visibilidade ao consumer",
      summary:
        "High watermark e o ponto ate onde o log e considerado seguro para leitura. Ele evita que consumers leiam records que podem desaparecer apos falha do leader.",
      internals: [
        "O leader acompanha ate onde replicas in-sync copiaram.",
        "Consumers leem apenas ate o high watermark.",
        "Offsets acima do high watermark podem existir no leader, mas ainda nao sao leitura estavel.",
        "Em leader election, o novo leader precisa preservar uma visao consistente do log confirmado.",
      ],
      configs: [
        "replication settings",
        "isolation.level em cenarios transacionais",
      ],
      design:
        "High watermark e uma escolha de consistencia: melhor atrasar visibilidade do que permitir que um consumer tome decisao sobre dado que pode sumir.",
      docs: "https://kafka.apache.org/documentation/#replication",
    },
    {
      title: "11. Consumer group recebe assignment e faz fetch",
      summary:
        "Consumers com o mesmo group.id dividem partitions. Cada partition e atribuida a no maximo um consumer do grupo no modelo classico.",
      internals: [
        "O group coordinator gerencia membros, heartbeats e assignments.",
        "Rebalance redistribui partitions quando membros entram, saem ou travam.",
        "Consumers fazem fetch em lotes e controlam quando fazem poll novamente.",
        "max.poll.interval.ms separa consumidor lento de consumidor morto.",
      ],
      configs: [
        "group.id",
        "max.poll.records",
        "max.poll.interval.ms",
        "session.timeout.ms",
        "partition.assignment.strategy",
      ],
      design:
        "Mais consumers que partitions nao aumentam paralelismo. Se uma partition concentra pedidos quentes, o group inteiro pode parecer subutilizado enquanto uma instancia sofre.",
      docs: "https://kafka.apache.org/documentation/#theconsumer",
    },
    {
      title: "12. Processamento, side effects e offset commit",
      summary:
        "O consumer processa o record e depois registra progresso. Offset commit nao apaga mensagem e nao garante que side effect externo foi feito exatamente uma vez.",
      internals: [
        "Offsets de grupos sao gravados no topic interno __consumer_offsets.",
        "Commit antes do processamento pode causar perda logica.",
        "Commit depois do processamento pode causar reprocessamento em caso de crash.",
        "Transacoes Kafka atomizam writes e offsets dentro do Kafka, mas nao cobrem banco/API externa automaticamente.",
      ],
      configs: [
        "enable.auto.commit=false para controle manual",
        "auto.offset.reset",
        "isolation.level=read_committed",
      ],
      design:
        "A arquitetura precisa de idempotency key, dedupe table, transactional outbox ou operacoes naturalmente idempotentes. Kafka entrega eventos; a aplicacao fecha a garantia de negocio.",
      docs: "https://kafka.apache.org/documentation/#semantics",
    },
  ];

  const glossary = [
    [
      "Broker",
      "Processo servidor Kafka que armazena partitions, responde clients e participa do cluster.",
      "Infra: pode rodar em VM, bare metal, container ou pod; precisa de disco persistente, rede e monitoramento.",
    ],
    [
      "Topic",
      "Categoria logica de records, dividida em partitions.",
      "Design: deve refletir dominio, ownership, contrato, retencao e consumidores esperados.",
    ],
    [
      "Partition",
      "Log ordenado dentro de um topic; unidade de ordem, paralelismo, replicacao e storage.",
      "Design: mais partitions aumentam paralelismo, mas tambem custo operacional e risco de reordenamento por key se mudar o particionamento.",
    ],
    [
      "Offset",
      "Posicao de um record dentro de uma partition.",
      "Design: permite replay, mas offset commit nao prova que um banco/API externa foi atualizado exatamente uma vez.",
    ],
    [
      "Producer",
      "Client que publica records, cria batches, escolhe partitions e lida com retries/acks.",
      "Design: para pedidos e pagamentos, combine acks=all, idempotencia, retries e observabilidade.",
    ],
    [
      "Consumer group",
      "Grupo de consumers que divide partitions para paralelizar o mesmo workload.",
      "Design: grupos diferentes leem independentemente; mesmo grupo escala o mesmo processamento.",
    ],
    [
      "Leader",
      "Replica principal de uma partition. Writes e reads passam pelo leader.",
      "Design: distribuicao de leaders impacta carga real dos brokers.",
    ],
    [
      "Follower",
      "Replica que copia dados do leader e pode virar leader em falha.",
      "Design: aumenta durabilidade e disponibilidade, com custo de disco e rede.",
    ],
    [
      "Replication factor",
      "Quantidade configurada de replicas de cada partition.",
      "Design: RF=3 e comum em producao; RF maior aumenta custo e tolerancia.",
    ],
    [
      "ISR",
      "In-Sync Replicas: replicas suficientemente atualizadas em relacao ao leader.",
      "Design: RF e desejo; ISR e realidade operacional. ISR pequeno reduz durabilidade real.",
    ],
    [
      "High watermark",
      "Maior ponto do log considerado seguro para leitura por consumers.",
      "Design: protege consistencia de leitura durante falhas de leader.",
    ],
    [
      "acks",
      "Configuracao do producer que define quando um write e considerado confirmado.",
      "Design: acks=all deve ser discutido junto com ISR e min.insync.replicas.",
    ],
    [
      "min.insync.replicas",
      "Minimo de replicas sincronizadas exigidas para aceitar writes com acks=all.",
      "Design: com RF=3 e minimo 2, o cluster tolera uma replica atrasada, mas bloqueia quando so resta uma em dia.",
    ],
    [
      "Retention",
      "Politica de permanencia dos records por tempo ou tamanho.",
      "Design: controla replay, auditoria, custo de disco e recuperacao.",
    ],
    [
      "Compaction",
      "Politica que preserva o ultimo valor por key e usa tombstones para exclusao logica.",
      "Design: boa para estado por key; ruim para auditoria completa.",
    ],
    [
      "KRaft",
      "Modo em que Kafka usa quorum proprio de controllers para metadata, sem ZooKeeper.",
      "Design: separa plano de controle da movimentacao de records no plano de dados.",
    ],
  ];

  const designQuestions = [
    "Qual e a entidade que exige ordenacao: order_id, customer_id, account_id ou outra?",
    "Qual garantia voce precisa: durabilidade no broker, entrega ao consumer, processamento na aplicacao ou efeito externo?",
    "O que acontece se o broker leader cair entre append, replicacao e ACK?",
    "Qual e o custo de RF=3 em disco e rede para cada MB/s produzido?",
    "Como o consumer evita duplicar pagamento, email ou escrita em banco quando reprocessa?",
    "Qual politica de retention permite replay sem estourar disco?",
    "Qual metrica detecta problema: lag por partition, ISR shrink, under-replicated partitions, request latency ou disco?",
    "Kafka e a escolha certa ou uma fila simples/chamada sincrona/banco resolve melhor?",
  ];

  function byId(id) {
    return document.getElementById(id);
  }

  function text(id, value) {
    byId(id).textContent = value;
  }

  function list(container, items) {
    container.innerHTML = "";
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      container.appendChild(li);
    });
  }

  function renderNav() {
    const nav = byId("study-nav");
    nav.innerHTML = '<div class="nav-heading">Estudos</div>';
    sections.forEach(([id, label]) => {
      const link = document.createElement("a");
      link.href = `#${id}`;
      link.textContent = label;
      nav.appendChild(link);
    });
  }

  function renderTags() {
    const container = byId("concept-tags");
    container.innerHTML = "";
    data.concepts.forEach((concept) => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = concept;
      container.appendChild(tag);
    });
  }

  function renderDiagram() {
    const container = byId("diagram");
    container.innerHTML = "";
    data.diagram.forEach(([from, to], index) => {
      const row = document.createElement("div");
      row.className = "diagram-row";
      row.innerHTML = `
        <i>${String(index + 1).padStart(2, "0")}</i>
        <span class="diagram-node"></span>
        <b></b>
        <span class="diagram-node"></span>
      `;
      row.querySelectorAll(".diagram-node")[0].textContent = from;
      row.querySelectorAll(".diagram-node")[1].textContent = to;
      container.appendChild(row);
    });
  }

  function renderTimeline() {
    const container = byId("timeline");
    container.innerHTML = "";
    lifecycleSteps.forEach(([title, body]) => {
      const item = document.createElement("article");
      item.className = "timeline-item";
      item.innerHTML = `<div><strong></strong><p></p></div>`;
      item.querySelector("strong").textContent = title;
      item.querySelector("p").textContent = body;
      container.appendChild(item);
    });
  }

  function renderDocumentedDefinitions() {
    const container = byId("documented-definitions");
    container.innerHTML = "";
    documentedDefinitions.forEach((item) => {
      const article = document.createElement("article");
      article.className = "definition-card";
      article.innerHTML = `
        <div class="definition-head">
          <strong></strong>
          <a target="_blank" rel="noreferrer">documentacao</a>
        </div>
        <p class="definition-doc"></p>
        <p class="definition-example"></p>
        <p class="definition-design"></p>
      `;
      article.querySelector("strong").textContent = item.term;
      article.querySelector("a").href = item.docs;
      article.querySelector(".definition-doc").textContent = `Definicao: ${item.definition}`;
      article.querySelector(".definition-example").textContent = `No exemplo: ${item.example}`;
      article.querySelector(".definition-design").textContent = `System design: ${item.design}`;
      container.appendChild(article);
    });
  }

  function renderTechnicalStages() {
    const container = byId("technical-stages");
    container.innerHTML = "";
    technicalStages.forEach((stage) => {
      const article = document.createElement("article");
      article.className = "stage-card";
      article.innerHTML = `
        <div class="stage-card-head">
          <h3></h3>
          <a target="_blank" rel="noreferrer">Doc oficial</a>
        </div>
        <p class="summary"></p>
        <div class="stage-columns">
          <div>
            <strong>Funcionamento interno</strong>
            <ul class="detail-list internals"></ul>
          </div>
          <div>
            <strong>Configuracoes e sinais</strong>
            <ul class="detail-list configs"></ul>
          </div>
        </div>
        <div class="design-note"></div>
      `;
      article.querySelector("h3").textContent = stage.title;
      article.querySelector("a").href = stage.docs;
      article.querySelector(".summary").textContent = stage.summary;
      article.querySelector(".design-note").textContent = `System design: ${stage.design}`;
      list(article.querySelector(".internals"), stage.internals);
      list(article.querySelector(".configs"), stage.configs);
      container.appendChild(article);
    });
  }

  function renderGlossary() {
    const container = byId("glossary");
    container.innerHTML = "";
    glossary.forEach(([term, definition, design]) => {
      const article = document.createElement("article");
      article.className = "term";
      article.innerHTML = "<strong></strong><p></p><small></small>";
      article.querySelector("strong").textContent = term;
      article.querySelector("p").textContent = definition;
      article.querySelector("small").textContent = design;
      container.appendChild(article);
    });
  }

  function renderReferences() {
    const container = byId("references");
    container.innerHTML = "";
    data.references.forEach(([label, url]) => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.textContent = label;
      li.appendChild(link);
      container.appendChild(li);
    });
  }

  function init() {
    text("title", data.title);
    text("summary", data.summary);
    text("theory-title", data.theoryTitle);
    text("theory-summary", data.theorySummary);
    const video = byId("study-video");
    video.src = data.video;
    video.load();
    byId("video-link").href = data.video;

    renderNav();
    renderTags();
    renderDiagram();
    renderTimeline();
    renderDocumentedDefinitions();
    renderTechnicalStages();
    renderGlossary();
    renderReferences();

    list(byId("goals"), data.goals);
    list(byId("deep-dive"), data.deepDive);
    list(byId("pitfalls"), data.pitfalls);
    list(byId("takeaways"), data.takeaways);
    list(byId("design-questions"), designQuestions);
  }

  init();
})();
