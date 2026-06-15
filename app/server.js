const http = require("node:http");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const { exec } = require("node:child_process");
const { challenges, actionDefinitions } = require("./challenges");

const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(__dirname, "public");
const progressFile = path.join(rootDir, ".learning-progress.json");
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 4173);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
};

function sendJson(response, status, payload) {
  response.writeHead(status, { "content-type": contentTypes[".json"] });
  response.end(JSON.stringify(payload, null, 2));
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf-8");
  return raw ? JSON.parse(raw) : {};
}

async function readProgress() {
  try {
    return JSON.parse(await fsp.readFile(progressFile, "utf-8"));
  } catch (error) {
    if (error.code === "ENOENT") {
      return { completed: {}, notes: {}, evaluations: {} };
    }
    throw error;
  }
}

async function writeProgress(progress) {
  await fsp.writeFile(progressFile, JSON.stringify(progress, null, 2));
}

function runCommand(action) {
  const definition = actionDefinitions[action];
  if (!definition) {
    return Promise.reject(new Error("Unknown action"));
  }

  const cwd = path.join(rootDir, definition.cwd);

  return new Promise((resolve) => {
    exec(
      definition.command,
      { cwd, timeout: 120_000, maxBuffer: 1024 * 1024 * 4 },
      (error, stdout, stderr) => {
        resolve({
          ok: !error,
          label: definition.label,
          command: definition.command,
          stdout,
          stderr,
          exitCode: error?.code ?? 0,
        });
      }
    );
  });
}

async function evaluateChallenge(challengeId) {
  const challenge = challenges.find((item) => item.id === challengeId);
  if (!challenge) {
    return { ok: false, message: "Desafio nao encontrado." };
  }

  const progress = await readProgress();
  const completed = progress.completed[challengeId] || [];
  const checklistScore = completed.length / challenge.checklist.length;
  const checks = [];

  if (challenge.environment === "cluster") {
    const clusterStatus = await runCommand("cluster-status");
    const topic = await runCommand("cluster-describe-topic");
    checks.push({
      name: "Cluster com 3 brokers",
      ok:
        clusterStatus.ok &&
        ["learning-kafka-1", "learning-kafka-2", "learning-kafka-3"].every((name) =>
          clusterStatus.stdout.includes(name)
        ),
    });
    checks.push({
      name: "Topic orders.internal com 6 partitions e RF 3",
      ok:
        topic.ok &&
        topic.stdout.includes("orders.internal") &&
        topic.stdout.includes("PartitionCount: 6") &&
        topic.stdout.includes("ReplicationFactor: 3"),
    });
  }

  if (challenge.environment === "single") {
    const status = await runCommand("single-status");
    checks.push({
      name: "Broker local em execucao",
      ok: status.ok && status.stdout.includes("learning-kafka"),
    });
  }

  if (challenge.environment === "none") {
    checks.push({
      name: "Checklist de design preenchido",
      ok: checklistScore === 1,
    });
  }

  const automatedOk = checks.every((item) => item.ok);
  const passed = automatedOk && checklistScore === 1;
  const result = {
    ok: passed,
    checklistScore,
    checks,
    rubric: challenge.rubric,
    message: passed
      ? "Desafio concluido com sucesso."
      : "Ainda ha pontos pendentes antes de considerar concluido.",
    evaluatedAt: new Date().toISOString(),
  };

  progress.evaluations[challengeId] = result;
  await writeProgress(progress);
  return result;
}

async function handleApi(request, response, pathname) {
  if (request.method === "GET" && pathname === "/api/challenges") {
    const progress = await readProgress();
    sendJson(response, 200, { challenges, actions: actionDefinitions, progress });
    return;
  }

  if (request.method === "POST" && pathname === "/api/progress") {
    const body = await readBody(request);
    const progress = await readProgress();
    progress.completed[body.challengeId] = Array.isArray(body.completed)
      ? body.completed
      : [];
    progress.notes[body.challengeId] = String(body.notes || "");
    await writeProgress(progress);
    sendJson(response, 200, { ok: true, progress });
    return;
  }

  if (request.method === "POST" && pathname === "/api/action") {
    const body = await readBody(request);
    sendJson(response, 200, await runCommand(body.action));
    return;
  }

  if (request.method === "POST" && pathname === "/api/evaluate") {
    const body = await readBody(request);
    sendJson(response, 200, await evaluateChallenge(body.challengeId));
    return;
  }

  sendJson(response, 404, { error: "Not found" });
}

function sendEmpty(response) {
  response.end();
}

async function serveMp4(request, response, resolved) {
  const stat = await fsp.stat(resolved);
  const fileSize = stat.size;
  const range = request.headers.range;
  const commonHeaders = {
    "accept-ranges": "bytes",
    "content-type": "video/mp4",
  };

  if (!range) {
    response.writeHead(200, {
      ...commonHeaders,
      "content-length": fileSize,
    });
    if (request.method === "HEAD") {
      sendEmpty(response);
      return;
    }
    fs.createReadStream(resolved).pipe(response);
    return;
  }

  const match = range.match(/^bytes=(\d*)-(\d*)$/);
  if (!match) {
    response.writeHead(416, { "content-range": `bytes */${fileSize}` });
    sendEmpty(response);
    return;
  }

  const start = match[1] ? Number(match[1]) : 0;
  const end = match[2] ? Number(match[2]) : fileSize - 1;

  if (start >= fileSize || end >= fileSize || start > end) {
    response.writeHead(416, { "content-range": `bytes */${fileSize}` });
    sendEmpty(response);
    return;
  }

  response.writeHead(206, {
    ...commonHeaders,
    "content-range": `bytes ${start}-${end}/${fileSize}`,
    "content-length": end - start + 1,
  });

  if (request.method === "HEAD") {
    sendEmpty(response);
    return;
  }

  fs.createReadStream(resolved, { start, end }).pipe(response);
}

async function serveStatic(request, response, pathname) {
  const filePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const resolved = path.resolve(publicDir, path.normalize(filePath));
  if (!resolved.startsWith(publicDir)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    if (path.extname(resolved) === ".mp4") {
      await serveMp4(request, response, resolved);
      return;
    }

    const data = await fsp.readFile(resolved);
    response.writeHead(200, {
      "content-length": data.length,
      "content-type": contentTypes[path.extname(resolved)] || "text/plain",
    });
    if (request.method === "HEAD") {
      sendEmpty(response);
      return;
    }
    response.end(data);
  } catch (error) {
    response.writeHead(404);
    response.end("Not found");
  }
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(request, response, url.pathname);
      return;
    }
    await serveStatic(request, response, url.pathname);
  } catch (error) {
    sendJson(response, 500, { error: error.message });
  }
});

server.listen(port, host, () => {
  console.log(`Learning dashboard running at http://${host}:${port}`);
});
