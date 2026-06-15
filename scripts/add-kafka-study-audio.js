const { execFile } = require("node:child_process");
const fsp = require("node:fs/promises");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const narrationFile = path.join(rootDir, "docs", "kafka", "kafka-study-narration.txt");
const audioDir = path.join(rootDir, "docs", "audio");
const wavFile = path.join(audioDir, "kafka-study-narration.wav");
const openAiMp3File = path.join(audioDir, "kafka-study-narration-openai.mp3");
const audioFile = path.join(audioDir, "kafka-study-narration.m4a");
const appVideo = path.join(rootDir, "app", "public", "videos", "kafka-study-guide.mp4");
const docsVideo = path.join(rootDir, "docs", "videos", "kafka-study-guide.mp4");
const tempVideo = path.join(audioDir, "kafka-study-guide.with-audio.mp4");
const openAiModel = process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts";
const openAiVoice = process.env.OPENAI_TTS_VOICE || "marin";
const provider = process.env.TTS_PROVIDER || (process.env.OPENAI_API_KEY ? "openai" : "say");
const openAiInstructions =
  process.env.OPENAI_TTS_INSTRUCTIONS ||
  [
    "Fale em portugues do Brasil, com voz natural de professor senior de engenharia.",
    "Use ritmo calmo, pausas claras entre ideias e entonacao didatica.",
    "Pronuncie termos tecnicos com cuidado: Kafka, broker, producer, consumer, partition, offset, ISR, acks, high watermark, KRaft.",
    "Nao soe como leitura mecanica; varie levemente a entonacao quando explicar trade-offs de system design.",
  ].join(" ");

function run(command, args) {
  return new Promise((resolve, reject) => {
    execFile(command, args, { maxBuffer: 1024 * 1024 * 8 }, (error, stdout, stderr) => {
      if (error) {
        error.message = `${error.message}\n${stderr}`;
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf-8").trim();
}

async function openAiApiKey() {
  if (process.env.OPENAI_API_KEY) {
    return process.env.OPENAI_API_KEY;
  }
  if (process.env.OPENAI_API_KEY_STDIN === "1") {
    return readStdin();
  }
  return "";
}

async function mediaDuration(filePath) {
  const { stdout } = await run("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    filePath,
  ]);
  return Number(stdout.trim());
}

function splitNarration(input) {
  const paragraphs = input
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const chunks = [];
  let current = "";

  paragraphs.forEach((paragraph) => {
    const next = current ? `${current}\n\n${paragraph}` : paragraph;
    if (next.length <= 2400) {
      current = next;
      return;
    }
    if (current) {
      chunks.push(current);
    }
    current = paragraph;
  });

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

async function generateOpenAiSpeech() {
  const apiKey = await openAiApiKey();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required when TTS_PROVIDER=openai.");
  }

  const narration = await fsp.readFile(narrationFile, "utf-8");
  const chunks = splitNarration(narration);
  const chunkFiles = [];
  console.log(`Generating OpenAI TTS in ${chunks.length} chunk(s) with ${openAiModel}/${openAiVoice}.`);

  for (const [index, input] of chunks.entries()) {
    console.log(`Generating chunk ${index + 1}/${chunks.length}...`);
    const chunkFile = path.join(
      audioDir,
      `kafka-study-narration-openai-${String(index + 1).padStart(2, "0")}.mp3`
    );
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120_000);
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: openAiModel,
        voice: openAiVoice,
        input,
        instructions: openAiInstructions,
        response_format: "mp3",
      }),
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`OpenAI TTS request failed: ${response.status} ${body}`);
    }

    await fsp.writeFile(chunkFile, Buffer.from(await response.arrayBuffer()));
    console.log(`Chunk ${index + 1}/${chunks.length} written.`);
    chunkFiles.push(chunkFile);
  }

  console.log("Concatenating OpenAI TTS chunks...");
  const concatFile = path.join(audioDir, "kafka-study-narration-openai.concat.txt");
  await fsp.writeFile(
    concatFile,
    chunkFiles.map((file) => `file '${file.replaceAll("'", "'\\''")}'`).join("\n"),
    "utf-8"
  );
  await run("ffmpeg", [
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    concatFile,
    "-c",
    "copy",
    openAiMp3File,
  ]);
  await fsp.rm(concatFile, { force: true });
  await Promise.all(chunkFiles.map((file) => fsp.rm(file, { force: true })));
  console.log("Normalizing OpenAI TTS audio...");
  await normalizeToAac(openAiMp3File);
}

async function generateMacSpeech() {
  await run("say", [
    "-v",
    "Luciana",
    "-r",
    "150",
    "--data-format=LEI16@44100",
    "-f",
    narrationFile,
    "-o",
    wavFile,
  ]);
  await normalizeToAac(wavFile);
  await fsp.rm(wavFile, { force: true });
}

async function normalizeToAac(inputFile) {
  await run("ffmpeg", [
    "-y",
    "-i",
    inputFile,
    "-filter:a",
    "loudnorm=I=-16:TP=-1.5:LRA=11",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    audioFile,
  ]);
}

async function muxVideo(videoPath, targetDuration) {
  const videoDuration = await mediaDuration(videoPath);
  const stretch = Math.max(targetDuration / videoDuration, 1).toFixed(6);
  await run("ffmpeg", [
    "-y",
    "-i",
    videoPath,
    "-i",
    audioFile,
    "-filter_complex",
    `[0:v]setpts=${stretch}*PTS[v]`,
    "-map",
    "[v]",
    "-map",
    "1:a:0",
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    "23",
    "-r",
    "15",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "copy",
    "-movflags",
    "+faststart",
    "-shortest",
    tempVideo,
  ]);
  await fsp.copyFile(tempVideo, videoPath);
  await fsp.rm(tempVideo, { force: true });
}

async function main() {
  await fsp.mkdir(audioDir, { recursive: true });
  if (provider === "openai") {
    await generateOpenAiSpeech();
  } else {
    await generateMacSpeech();
  }
  const audioDuration = await mediaDuration(audioFile);
  await muxVideo(appVideo, audioDuration);
  await fsp.mkdir(path.dirname(docsVideo), { recursive: true });
  await fsp.copyFile(appVideo, docsVideo);
  console.log(
    `Kafka study narration generated with ${provider} at ${audioDuration.toFixed(1)}s and muxed into both videos.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
