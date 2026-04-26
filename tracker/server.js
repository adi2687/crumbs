import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

const upload = multer({ dest: "uploads/" });

const peers = {};
const TIMEOUT = 15000;

const HEARTBEAT_LOG = path.resolve(__dirname, "..", "ml", "logs", "heartbeats.jsonl");

function ensureJsonlLog() {
  const dir = path.dirname(HEARTBEAT_LOG);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(HEARTBEAT_LOG)) {
    fs.writeFileSync(HEARTBEAT_LOG, "");
    return;
  }
  const content = fs.readFileSync(HEARTBEAT_LOG, "utf8").trim();
  if (!content || !content.startsWith("[")) return;
  try {
    const records = JSON.parse(content);
    const lines = records.map((r) => JSON.stringify(r)).join("\n") + "\n";
    fs.writeFileSync(HEARTBEAT_LOG, lines);
    console.log(`Normalized ${records.length} heartbeat records to JSONL`);
  } catch (err) {
    console.warn("Could not normalize heartbeats.jsonl:", err.message);
  }
}
ensureJsonlLog();

function logHeartbeat(record) {
  fs.appendFile(HEARTBEAT_LOG, JSON.stringify(record) + "\n", (err) => {
    if (err) console.warn("heartbeat log write failed:", err.message);
  });
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/heartbeat", (req, res) => {
  const { peerId, missedCount = 0, latencyMs = 0, day, hour } = req.body;
  if (!peerId) return res.status(400).json({ error: "peerId required" });
  peers[peerId] = Date.now();

  const now = new Date();
  const mc = Number(missedCount) || 0;
  const record = {
    peerId,
    missedCount: mc,
    latencyMs: Number(latencyMs) || 0,
    day: Number.isInteger(day) ? day : now.getDay(),
    hour: Number.isInteger(hour) ? hour : now.getHours(),
    label: mc >= 3 ? 1 : 0,
  };
  logHeartbeat(record);
  res.json({ ok: true });
});

app.post("/register", (req, res) => {
  const { peerId } = req.body;
  if (!peerId) return res.status(400).json({ error: "peerId required" });
  peers[peerId] = Date.now();
  console.log("peer registered");
  res.json({ ok: true });
});

app.get("/peers", (req, res) => {
  const now = Date.now();
  const onlinePeers = Object.entries(peers)
    .filter(([_, lastSeen]) => now - lastSeen <= TIMEOUT)
    .map(([id]) => id);
  res.json({ count: onlinePeers.length, online: onlinePeers });
});

app.post("/upload", upload.single("file"), (req, res) => {
  const uniquename = req.file.originalname;
  const destPath = `uploads/${uniquename}`;
  fs.renameSync(req.file.path, destPath);
  console.log(`File uploaded: ${req.file.originalname}`);
  res.json({ ok: true, filename: uniquename });
});

app.get("/files/:filename", (req, res) => {
  const path = `uploads/${req.params.filename}`;
  if (fs.existsSync(path)) {
    res.download(path);
  } else {
    res.status(404).json({ error: "File not found" });
  }
});

setInterval(() => {
  const now = Date.now();
  for (const id in peers) {
    if (now - peers[id] > TIMEOUT) {
      console.log(`${id} timed out`);
      delete peers[id];
    }
  }
}, 10000);

const address = process.env.ADDRESS;
const port = process.env.PORT || 7000;
app.listen(port, address, () => console.log(`Server running on http://${address}:${port}`));
