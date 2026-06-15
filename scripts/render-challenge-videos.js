const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { videoChallenges } = require("../src/remotion/challenge-videos/videoData.cjs");

const root = path.resolve(__dirname, "..");
const outputDir = path.join(root, "app/public/videos");

fs.mkdirSync(outputDir, { recursive: true });

for (const challenge of videoChallenges) {
  const compositionId = `ChallengeVideo-${challenge.id}`;
  const output = path.join(outputDir, `${challenge.id}.mp4`);
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
    ],
    { cwd: root, stdio: "inherit" }
  );
}
