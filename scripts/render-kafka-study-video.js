const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const outputDir = path.join(root, "app/public/videos");
const compositionId = "ChallengeVideo-kafka-study-guide";
const output = path.join(outputDir, "kafka-study-guide.mp4");

fs.mkdirSync(outputDir, { recursive: true });

console.log(`Rendering ${compositionId} -> ${output}`);
execFileSync(
  "npx",
  [
    "remotion",
    "render",
    "src/remotion/index.ts",
    compositionId,
    output,
    "--log=warn",
    "--timeout=120000",
    "--concurrency=1",
  ],
  { cwd: root, stdio: "inherit" }
);
