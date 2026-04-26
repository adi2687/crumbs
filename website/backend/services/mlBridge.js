import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ML_DIR = path.resolve(__dirname, "..", "..", "..", "ml");
const PYTHON_CMD = process.env.PYTHON_CMD || (process.platform === "win32" ? "python" : "python3");
const INTERVAL_MS = Number(process.env.ML_INTERVAL_MS) || 30_000;

let lastRun = null;
let lastError = null;
let running = false;

function runPredictions() {
  if (running) return;
  running = true;

  const proc = spawn(PYTHON_CMD, ["predict.py"], {
    cwd: ML_DIR,
    stdio: ["ignore", "pipe", "pipe"],
  });

  let stderr = "";
  proc.stderr.on("data", (d) => (stderr += d.toString()));

  proc.on("close", (code) => {
    running = false;
    lastRun = new Date().toISOString();
    if (code === 0) {
      lastError = null;
    } else {
      lastError = `predict.py exit ${code}: ${stderr.slice(0, 500).trim()}`;
      console.warn("[mlBridge]", lastError);
    }
  });

  proc.on("error", (err) => {
    running = false;
    lastRun = new Date().toISOString();
    lastError = `failed to spawn ${PYTHON_CMD}: ${err.message}`;
    console.warn("[mlBridge]", lastError);
  });
}

export function startMlBridge() {
  console.log(`[mlBridge] starting — every ${INTERVAL_MS}ms (cwd=${ML_DIR})`);
  runPredictions();
  setInterval(runPredictions, INTERVAL_MS);
}

export function getStatus() {
  return { lastRun, lastError, running };
}
