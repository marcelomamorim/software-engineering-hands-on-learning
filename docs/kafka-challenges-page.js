(function () {
  const challenges = window.KAFKA_CHALLENGES_DATA || [];
  const catalog = document.getElementById("challenge-catalog");

  function environmentLabel(environment) {
    if (environment === "cluster") {
      return "Cluster Kafka 3 brokers";
    }
    if (environment === "single") {
      return "Kafka single broker";
    }
    return "Design + checklist";
  }

  catalog.innerHTML = "";
  challenges.forEach((challenge, index) => {
    const article = document.createElement("article");
    article.className = "challenge-card";
    article.innerHTML = `
      <div class="challenge-number">${String(index + 1).padStart(2, "0")}</div>
      <div>
        <div class="challenge-card-head">
          <span></span>
          <small></small>
        </div>
        <h2></h2>
        <p></p>
        <div class="challenge-meta-list"></div>
        <div class="challenge-actions">
          <a>Visualizar lab</a>
          <code></code>
        </div>
      </div>
    `;
    article.querySelector(".challenge-card-head span").textContent = environmentLabel(
      challenge.environment
    );
    article.querySelector(".challenge-card-head small").textContent = challenge.duration;
    article.querySelector("h2").textContent = challenge.title;
    article.querySelector("p").textContent = challenge.summary;
    const meta = article.querySelector(".challenge-meta-list");
    (challenge.topics.length ? challenge.topics : ["conceitual"]).forEach((topic) => {
      const pill = document.createElement("span");
      pill.textContent = topic;
      meta.appendChild(pill);
    });
    article.querySelector("a").href = challenge.labReadme;
    article.querySelector("code").textContent = `cd labs/kafka/challenges/${challenge.id} && docker compose up -d && ./verify.sh`;
    catalog.appendChild(article);
  });
})();
