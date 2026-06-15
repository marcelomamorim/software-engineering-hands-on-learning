let state = {
  challenges: [],
  actions: {},
  progress: { completed: {}, notes: {}, evaluations: {} },
  selectedId: null,
};

const themes = [
  {
    id: "kafka",
    label: "Kafka",
    description: "estudos, log distribuido, partitions, consumers e falhas",
    matches: (challenge) => challenge.area === "Kafka",
  },
];

const elements = {
  nav: document.querySelector("#challenge-nav"),
  overallProgress: document.querySelector("#overall-progress"),
  overallBar: document.querySelector("#overall-bar"),
  area: document.querySelector("#challenge-area"),
  title: document.querySelector("#challenge-title"),
  meta: document.querySelector("#challenge-meta"),
  summary: document.querySelector("#challenge-summary"),
  theoryPanel: document.querySelector("#theory-panel"),
  theoryTitle: document.querySelector("#theory-title"),
  theorySummary: document.querySelector("#theory-summary"),
  theoryDiagram: document.querySelector("#theory-diagram"),
  theoryGoals: document.querySelector("#theory-goals"),
  theoryIdeas: document.querySelector("#theory-ideas"),
  theoryPreLab: document.querySelector("#theory-prelab"),
  theoryDeepSection: document.querySelector("#theory-deep-section"),
  theoryDeepDive: document.querySelector("#theory-deep-dive"),
  theoryPitfalls: document.querySelector("#theory-pitfalls"),
  theoryTakeaways: document.querySelector("#theory-takeaways"),
  theoryRefs: document.querySelector("#theory-refs"),
  video: document.querySelector("#challenge-video"),
  videoSource: document.querySelector("#challenge-video-source"),
  videoLink: document.querySelector("#challenge-video-link"),
  scenario: document.querySelector("#challenge-scenario"),
  concepts: document.querySelector("#concept-list"),
  tasks: document.querySelector("#task-list"),
  decisions: document.querySelector("#decision-list"),
  deliverables: document.querySelector("#deliverable-list"),
  environment: document.querySelector("#environment-label"),
  actions: document.querySelector("#action-list"),
  output: document.querySelector("#command-output"),
  checklist: document.querySelector("#checklist"),
  challengeProgress: document.querySelector("#challenge-progress"),
  challengeBar: document.querySelector("#challenge-bar"),
  notes: document.querySelector("#notes"),
  save: document.querySelector("#save-button"),
  evaluate: document.querySelector("#evaluate-button"),
  evaluationState: document.querySelector("#evaluation-state"),
  evaluationResult: document.querySelector("#evaluation-result"),
};

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "content-type": "application/json" },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

function selectedChallenge() {
  return state.challenges.find((challenge) => challenge.id === state.selectedId);
}

function percent(value) {
  return `${Math.round(value * 100)}%`;
}

function completedFor(challengeId) {
  return state.progress.completed[challengeId] || [];
}

function challengeScore(challenge) {
  return completedFor(challenge.id).length / challenge.checklist.length;
}

function themeFor(challenge) {
  return themes.find((theme) => theme.matches(challenge));
}

function themeScore(challenges) {
  const total = challenges.reduce(
    (sum, challenge) => sum + challenge.checklist.length,
    0
  );
  const done = challenges.reduce(
    (sum, challenge) => sum + completedFor(challenge.id).length,
    0
  );
  return total === 0 ? 0 : done / total;
}

function renderNav() {
  elements.nav.innerHTML = "";

  const rendered = new Set();
  themes.forEach((theme) => {
    const challenges = state.challenges.filter((challenge) => {
      if (rendered.has(challenge.id)) {
        return false;
      }
      const matches = themeFor(challenge)?.id === theme.id;
      if (matches) {
        rendered.add(challenge.id);
      }
      return matches;
    });

    if (challenges.length === 0) {
      return;
    }

    const group = document.createElement("section");
    group.className = "theme-group";
    group.innerHTML = `
      <div class="theme-heading">
        <strong>${theme.label}</strong>
        <span>${theme.description}</span>
        <small>${percent(themeScore(challenges))}</small>
      </div>
    `;

    challenges.forEach((challenge) => {
      const button = document.createElement("button");
      button.className = `nav-item ${
        challenge.id === state.selectedId ? "active" : ""
      }`;
      button.type = "button";
      button.innerHTML = `
        <strong>${challenge.title}</strong>
        <span>${challenge.area} · ${percent(challengeScore(challenge))}</span>
      `;
      button.addEventListener("click", () => {
        state.selectedId = challenge.id;
        render();
      });
      group.appendChild(button);
    });

    elements.nav.appendChild(group);
  });
}

function renderOverallProgress() {
  const total = state.challenges.reduce(
    (sum, challenge) => sum + challenge.checklist.length,
    0
  );
  const done = state.challenges.reduce(
    (sum, challenge) => sum + completedFor(challenge.id).length,
    0
  );
  const score = total === 0 ? 0 : done / total;
  elements.overallProgress.textContent = percent(score);
  elements.overallBar.style.width = percent(score);
}

function renderChallenge() {
  const challenge = selectedChallenge();
  const score = challengeScore(challenge);
  elements.area.textContent = challenge.area;
  elements.title.textContent = challenge.title;
  elements.meta.textContent = `${challenge.level} · ${challenge.duration}`;
  elements.summary.textContent = challenge.summary;
  const videoFile = challenge.video || `${challenge.id}.mp4`;
  const nextVideo = `/videos/${videoFile}`;
  if (!elements.videoSource.src.endsWith(nextVideo)) {
    elements.videoSource.src = nextVideo;
    elements.videoLink.href = nextVideo;
    elements.video.load();
  }
  elements.scenario.textContent = challenge.scenario || "";
  elements.environment.textContent =
    challenge.environment === "none"
      ? "Sem ambiente automatizado"
      : challenge.environment === "cluster"
        ? "Cluster Kafka"
        : "Kafka local";
  elements.challengeProgress.textContent = percent(score);
  elements.challengeBar.style.width = percent(score);
  elements.notes.value = state.progress.notes[challenge.id] || "";

  elements.concepts.innerHTML = "";
  challenge.concepts.forEach((concept) => {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = concept;
    elements.concepts.appendChild(tag);
  });

  renderList(elements.tasks, challenge.tasks || [], "ol");
  renderList(elements.decisions, challenge.decisions || [], "ul");
  renderList(elements.deliverables, challenge.deliverables || [], "ul");

  renderTheory(challenge);
  renderActions(challenge);
  renderChecklist(challenge);
  renderEvaluation(challenge);
}

function renderTheory(challenge) {
  const theory = challenge.theory;
  elements.theoryPanel.hidden = !theory;

  if (!theory) {
    return;
  }

  elements.theoryTitle.textContent = theory.title;
  elements.theorySummary.textContent = theory.summary;
  renderList(elements.theoryGoals, theory.goals || []);
  renderList(elements.theoryIdeas, theory.keyIdeas || []);
  renderList(elements.theoryPreLab, theory.preLabChecklist || []);
  renderList(elements.theoryPitfalls, theory.pitfalls || []);
  renderList(elements.theoryTakeaways, theory.expectedTakeaways || []);
  renderOptionalListSection(
    elements.theoryDeepSection,
    elements.theoryDeepDive,
    theory.deepDive || []
  );
  renderReferences(
    elements.theoryRefs,
    theory.references || [...(theory.docs || []), ...(theory.articles || [])]
  );
  renderDiagram(elements.theoryDiagram, theory.diagram || []);
}

function renderList(container, items) {
  container.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    container.appendChild(li);
  });
}

function renderOptionalListSection(section, container, items) {
  section.hidden = items.length === 0;
  renderList(container, items);
}

function renderReferences(container, references) {
  container.innerHTML = "";
  references.forEach(([label, url]) => {
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

function renderDiagram(container, edges) {
  container.innerHTML = "";
  edges.forEach(([from, to], index) => {
    const row = document.createElement("div");
    row.className = "diagram-row";
    row.style.setProperty("--step", String(index + 1));
    const fromNode = document.createElement("span");
    fromNode.className = "diagram-node-label";
    const arrow = document.createElement("b");
    const toNode = document.createElement("span");
    toNode.className = "diagram-node-label";
    const step = document.createElement("i");
    step.textContent = String(index + 1).padStart(2, "0");
    fromNode.textContent = from;
    arrow.textContent = "";
    toNode.textContent = to;
    row.append(step, fromNode, arrow, toNode);
    container.appendChild(row);
  });
}

function renderActions(challenge) {
  elements.actions.innerHTML = "";
  elements.output.hidden = challenge.actions.length === 0;

  if (challenge.actions.length === 0) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent =
      "Este desafio e conceitual. Use o checklist, as anotacoes e a avaliacao final.";
    elements.actions.appendChild(empty);
    return;
  }

  challenge.actions.forEach((actionId) => {
    elements.output.hidden = false;
    const action = state.actions[actionId];
    const button = document.createElement("button");
    button.className = "action-button";
    button.type = "button";
    button.textContent = action.label;
    button.addEventListener("click", () => runAction(actionId));
    elements.actions.appendChild(button);
  });
}

function renderChecklist(challenge) {
  const completed = new Set(completedFor(challenge.id));
  elements.checklist.innerHTML = "";
  challenge.checklist.forEach((item, index) => {
    const label = document.createElement("label");
    label.className = "check-item";
    label.innerHTML = `
      <input type="checkbox" ${completed.has(index) ? "checked" : ""} />
      <span>${item}</span>
    `;
    label.querySelector("input").addEventListener("change", async (event) => {
      const next = new Set(completedFor(challenge.id));
      if (event.target.checked) {
        next.add(index);
      } else {
        next.delete(index);
      }
      state.progress.completed[challenge.id] = [...next].sort((a, b) => a - b);
      await saveProgress();
      render();
    });
    elements.checklist.appendChild(label);
  });
}

function renderEvaluation(challenge) {
  const evaluation = state.progress.evaluations[challenge.id];
  elements.evaluationResult.innerHTML = "";

  if (!evaluation) {
    elements.evaluationState.textContent = "Nao avaliado";
    const item = document.createElement("div");
    item.className = "eval-line";
    item.textContent =
      "Quando terminar o checklist e os experimentos, rode a avaliacao para checar os sinais automaticos e a rubrica.";
    elements.evaluationResult.appendChild(item);
    return;
  }

  elements.evaluationState.textContent = evaluation.ok ? "Concluido" : "Pendente";

  const summary = document.createElement("div");
  summary.className = `eval-line ${evaluation.ok ? "ok" : "fail"}`;
  summary.textContent = `${evaluation.message} Checklist: ${percent(
    evaluation.checklistScore
  )}.`;
  elements.evaluationResult.appendChild(summary);

  evaluation.checks.forEach((check) => {
    const line = document.createElement("div");
    line.className = `eval-line ${check.ok ? "ok" : "fail"}`;
    line.textContent = `${check.ok ? "OK" : "Pendente"} · ${check.name}`;
    elements.evaluationResult.appendChild(line);
  });

  evaluation.rubric.forEach((rubric) => {
    const line = document.createElement("div");
    line.className = "eval-line";
    line.textContent = `Rubrica · ${rubric}`;
    elements.evaluationResult.appendChild(line);
  });
}

async function saveProgress() {
  const challenge = selectedChallenge();
  state.progress.notes[challenge.id] = elements.notes.value;
  const result = await api("/api/progress", {
    method: "POST",
    body: JSON.stringify({
      challengeId: challenge.id,
      completed: completedFor(challenge.id),
      notes: elements.notes.value,
    }),
  });
  state.progress = result.progress;
}

async function runAction(action) {
  elements.output.textContent = `Executando: ${state.actions[action].command}\n`;
  const result = await api("/api/action", {
    method: "POST",
    body: JSON.stringify({ action }),
  });
  elements.output.textContent = [
    `$ ${result.command}`,
    result.ok ? "status: ok" : `status: erro (${result.exitCode})`,
    result.stdout,
    result.stderr,
  ]
    .filter(Boolean)
    .join("\n\n");
}

async function evaluateSelected() {
  await saveProgress();
  const challenge = selectedChallenge();
  elements.evaluationState.textContent = "Avaliando...";
  const result = await api("/api/evaluate", {
    method: "POST",
    body: JSON.stringify({ challengeId: challenge.id }),
  });
  state.progress.evaluations[challenge.id] = result;
  render();
}

function render() {
  renderOverallProgress();
  renderNav();
  renderChallenge();
}

async function init() {
  const data = await api("/api/challenges");
  state = {
    ...state,
    challenges: data.challenges,
    actions: data.actions,
    progress: data.progress,
  selectedId:
      data.challenges.find((challenge) => challenge.id === "kafka-study-guide")?.id ||
      data.challenges[0]?.id,
  };
  elements.save.addEventListener("click", async () => {
    await saveProgress();
    render();
  });
  elements.evaluate.addEventListener("click", evaluateSelected);
  render();
}

init().catch((error) => {
  document.body.innerHTML = `<pre>${error.stack}</pre>`;
});
