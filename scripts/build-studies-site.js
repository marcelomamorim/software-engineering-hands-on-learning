const fsp = require("node:fs/promises");
const path = require("node:path");
const { kafkaChallenges } = require("../app/kafka-challenges");

const rootDir = path.resolve(__dirname, "..");
const docsDir = path.join(rootDir, "docs");
const docsVideosDir = path.join(docsDir, "videos");
const distDir = path.join(rootDir, "dist", "studies");
const distVideosDir = path.join(distDir, "videos");
const labsChallengesDir = path.join(rootDir, "labs", "kafka", "challenges");
const distLabsChallengesDir = path.join(distDir, "labs", "kafka", "challenges");
const publicVideosDir = path.join(rootDir, "app", "public", "videos");

const topicByAction = {
  "cluster-create-topic": "orders.internal",
  "cluster-create-record-topic": "record.lifecycle",
  "cluster-create-finance-topic": "finance.events",
  "cluster-create-offsets-topic": "consumer.offsets.lab",
  "cluster-create-rebalance-topic": "rebalance.lab",
  "cluster-create-lifecycle-topic": "order.lifecycle",
  "cluster-create-catalog-topic": "catalog.orders.v1",
  "cluster-create-compacted-topic": "customer.snapshot",
  "cluster-create-perf-topic": "perf.events",
  "cluster-create-incident-topic": "incident.orders",
};

const multiTopicByAction = {
  "cluster-create-transaction-topics": ["payment.commands", "payment.events.tx"],
  "cluster-create-payment-topics": ["payment.events", "payment.retry", "payment.dlq"],
};

function quote(value) {
  return JSON.stringify(value, null, 2);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function inlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function markdownToHtml(markdown) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let inCode = false;
  let codeLang = "";
  let codeLines = [];
  let inList = false;

  function closeList() {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  }

  function closeCode() {
    html.push(
      `<pre><code${codeLang ? ` class="language-${escapeHtml(codeLang)}"` : ""}>${escapeHtml(
        codeLines.join("\n")
      )}</code></pre>`
    );
    inCode = false;
    codeLang = "";
    codeLines = [];
  }

  for (const line of lines) {
    const codeMatch = line.match(/^```(\w+)?/);
    if (codeMatch) {
      if (inCode) {
        closeCode();
      } else {
        closeList();
        inCode = true;
        codeLang = codeMatch[1] || "";
        codeLines = [];
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (!line.trim()) {
      closeList();
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      closeList();
      const level = Math.min(heading[1].length + 1, 5);
      html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }

    const listItem = line.match(/^-\s+\[( |x)\]\s+(.+)$/i) || line.match(/^-\s+(.+)$/);
    if (listItem) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      const text = listItem.length === 3 ? listItem[2] : listItem[1];
      const prefix = listItem.length === 3 ? `<span class="checkmark">□</span> ` : "";
      html.push(`<li>${prefix}${inlineMarkdown(text)}</li>`);
      continue;
    }

    closeList();
    html.push(`<p>${inlineMarkdown(line)}</p>`);
  }

  closeList();
  if (inCode) {
    closeCode();
  }
  return html.join("\n");
}

async function copyIfExists(from, to) {
  try {
    await fsp.mkdir(path.dirname(to), { recursive: true });
    await fsp.copyFile(from, to);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

async function readTextIfExists(filePath) {
  try {
    return await fsp.readFile(filePath, "utf-8");
  } catch (error) {
    if (error.code === "ENOENT") {
      return "";
    }
    throw error;
  }
}

async function labViewerHtml(challenge, labDir) {
  const [readme, compose, verify, solution, systemicVerify] = await Promise.all([
    readTextIfExists(path.join(labDir, "README.md")),
    readTextIfExists(path.join(labDir, "docker-compose.yml")),
    readTextIfExists(path.join(labDir, "verify.sh")),
    readTextIfExists(path.join(labDir, "solution.md")),
    readTextIfExists(path.join(labDir, "systemic-verify.sh")),
  ]);
  const command = `cd labs/kafka/challenges/${challenge.id} && docker compose up -d && ./verify.sh`;
  const rawFiles = [
    ["README.md", readme],
    ["docker-compose.yml", compose],
    ["verify.sh", verify],
    ["solution.md", solution],
    ["systemic-verify.sh", systemicVerify],
  ].filter(([, content]) => content);

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(challenge.title)} | Lab Kafka</title>
    <link rel="stylesheet" href="../../../../studies.css" />
  </head>
  <body>
    <div class="study-shell lab-viewer">
      <header class="study-header">
        <div class="track-topbar">
          <a class="track-logo" href="../../../../index.html">Engineering Learning Lab</a>
          <nav class="track-tabs" aria-label="Navegacao do lab">
            <a href="../../../../kafka.html">Estudo Kafka</a>
            <a class="active" href="../../../../kafka-challenges.html">Desafios Kafka</a>
          </nav>
        </div>
        <div class="study-header-inner">
          <div>
            <p class="eyebrow">Lab Kafka</p>
            <h1>${escapeHtml(challenge.title)}</h1>
            <p class="lede">${escapeHtml(challenge.summary)}</p>
          </div>
          <div class="header-actions">
            <a class="button primary" href="../../../../kafka-challenges.html">Voltar aos desafios</a>
            <a class="button" href="./README.md" download>Baixar README</a>
          </div>
        </div>
      </header>

      <main class="lab-main">
        <section class="lab-panel">
          <div class="section-heading">
            <p class="eyebrow">Roteiro</p>
            <h2>Leia antes de executar</h2>
          </div>
          <div class="rendered-readme">${markdownToHtml(readme)}</div>
        </section>

        <section class="lab-panel">
          <div class="section-heading">
            <p class="eyebrow">Execucao local</p>
            <h2>Comando principal</h2>
          </div>
          <pre class="command-box"><code>${escapeHtml(command)}</code></pre>
          <p class="lab-note">No GitHub Pages voce visualiza os arquivos. A execucao acontece no clone local do repositorio. O verificador do cenario fica na mesma pasta do lab: <code>verify.sh</code> carrega <code>systemic-verify.sh</code>.</p>
        </section>

        <section class="lab-panel">
          <div class="section-heading">
            <p class="eyebrow">Arquivos do lab</p>
            <h2>Compose, verificador e resposta</h2>
          </div>
          <div class="lab-file-grid">
            ${rawFiles
              .map(
                ([fileName, content]) => `<article class="file-panel">
              <div class="file-panel-head">
                <h3>${escapeHtml(fileName)}</h3>
                <a href="./${escapeHtml(fileName)}" download>Baixar</a>
              </div>
              <pre><code>${escapeHtml(content)}</code></pre>
            </article>`
              )
              .join("\n")}
          </div>
        </section>
      </main>
    </div>
  </body>
</html>
`;
}

async function build() {
  const study = kafkaChallenges.find((challenge) => challenge.id === "kafka-study-guide");
  if (!study) {
    throw new Error("Kafka study challenge not found");
  }

  const videoFile = study.video || `${study.id}.mp4`;
  const videoCopied = await copyIfExists(
    path.join(publicVideosDir, videoFile),
    path.join(docsVideosDir, videoFile)
  );

  const payload = {
    id: study.id,
    title: study.title,
    summary: study.summary,
    concepts: study.concepts,
    theoryTitle: study.theory.title,
    theorySummary: study.theory.summary,
    goals: study.theory.goals,
    deepDive: study.theory.deepDive,
    pitfalls: study.theory.pitfalls,
    takeaways: study.theory.expectedTakeaways,
    diagram: study.theory.diagram,
    references: study.theory.references,
    video: `./videos/${videoFile}`,
  };

  await fsp.writeFile(
    path.join(docsDir, "studies-data.js"),
    `window.STUDIES_DATA = ${quote(payload)};\n`,
    "utf-8"
  );

  const challengePayload = kafkaChallenges
    .filter((challenge) => challenge.id !== "kafka-study-guide")
    .map((challenge) => {
      const topics = new Set();
      for (const action of challenge.actions || []) {
        if (topicByAction[action]) {
          topics.add(topicByAction[action]);
        }
        for (const topic of multiTopicByAction[action] || []) {
          topics.add(topic);
        }
      }
      if (challenge.id === "kafka-single-broker") {
        topics.add("orders.events");
      }
      return {
        id: challenge.id,
        title: challenge.title,
        summary: challenge.summary,
        duration: challenge.duration,
        environment: challenge.environment,
        topics: [...topics],
        labReadme: `./labs/kafka/challenges/${challenge.id}/`,
      };
    });

  await fsp.writeFile(
    path.join(docsDir, "kafka-challenges-data.js"),
    `window.KAFKA_CHALLENGES_DATA = ${quote(challengePayload)};\n`,
    "utf-8"
  );

  await fsp.rm(distDir, { recursive: true, force: true });
  await fsp.mkdir(distVideosDir, { recursive: true });
  await Promise.all(
    [
      "index.html",
      "kafka.html",
      "kafka-challenges.html",
      "kafka-challenges-page.js",
      "kafka-challenges-data.js",
      "studies.css",
      "studies-app.js",
      "studies-data.js",
    ].map((file) => fsp.copyFile(path.join(docsDir, file), path.join(distDir, file)))
  );
  await fsp.writeFile(path.join(distDir, ".nojekyll"), "", "utf-8");
  await fsp.copyFile(path.join(docsDir, "index.html"), path.join(distDir, "404.html"));
  await fsp.writeFile(
    path.join(distDir, "site.json"),
    `${quote({
      name: "Software Engineering Hands-on Learning",
      track: "Kafka",
      generatedAt: new Date().toISOString(),
      entrypoints: ["index.html", "kafka.html", "kafka-challenges.html"],
    })}\n`,
    "utf-8"
  );
  await fsp.mkdir(path.join(distDir, "kafka"), { recursive: true });
  await fsp.cp(labsChallengesDir, distLabsChallengesDir, {
    recursive: true,
    force: true,
  });
  await Promise.all(
    challengePayload.map(async (challenge) => {
      const sourceLabDir = path.join(labsChallengesDir, challenge.id);
      const targetLabDir = path.join(distLabsChallengesDir, challenge.id);
      await fsp.writeFile(
        path.join(targetLabDir, "index.html"),
        await labViewerHtml(challenge, sourceLabDir),
        "utf-8"
      );
    })
  );
  await Promise.all(
    ["message-lifecycle.md", "challenges.md"].map((file) =>
      fsp.copyFile(path.join(docsDir, "kafka", file), path.join(distDir, "kafka", file))
    )
  );
  await copyIfExists(
    path.join(docsVideosDir, videoFile),
    path.join(distVideosDir, videoFile)
  );

  console.log(`Studies site data generated at docs/studies-data.js`);
  console.log(`Studies site artifact generated at dist/studies`);
  console.log(
    videoCopied
      ? `Copied video to docs/videos/${videoFile}`
      : `Video not found at app/public/videos/${videoFile}; page will keep the expected path.`
  );
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
