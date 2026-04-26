import express from "express";
import multer from "multer";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ML_LOGS = path.resolve(__dirname, "..", "..", "..", "ml", "logs");
const PRED_FILE = path.join(ML_LOGS, "predictions.json");
const MAP_DIR = path.join(ML_LOGS, "uploads");

const TRACKER_URL = process.env.TRACKER_URL || "http://localhost:7000";
const CHUNK_SIZE = 100 * 1024;

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 100 * 1024 * 1024 } });

async function loadHealthyPeers() {
  try {
    const raw = await fs.readFile(PRED_FILE, "utf8");
    const preds = JSON.parse(raw);
    const ranked = Object.entries(preds)
      .map(([peerId, p]) => ({ peerId, ...p }))
      .sort((a, b) => (a.risk_score ?? 1) - (b.risk_score ?? 1));
    const healthy = ranked.filter((p) => p.status === "HEALTHY");
    return { healthy, ranked };
  } catch {
    return { healthy: [], ranked: [] };
  }
}

async function forwardShardToTracker(shardName, buffer) {
  const form = new FormData();
  form.append("file", new Blob([buffer]), shardName);
  const res = await fetch(`${TRACKER_URL}/upload`, { method: "POST", body: form });
  if (!res.ok) throw new Error(`tracker upload failed (${res.status})`);
  return res.json();
}

router.post("/file", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "no file uploaded (field name must be 'file')" });
  }

  const { healthy, ranked } = await loadHealthyPeers();
  const placementPool = healthy.length ? healthy : ranked;

  const fileName = req.file.originalname;
  const buffer = req.file.buffer;
  const shards = [];

  try {
    for (let i = 0, part = 1; i < buffer.length; i += CHUNK_SIZE, part++) {
      const chunk = buffer.subarray(i, Math.min(i + CHUNK_SIZE, buffer.length));
      const hash = crypto.createHash("sha256").update(chunk).digest("hex");
      const shardName = `${fileName}.${hash}.part${part}`;

      const peer =
        placementPool.length > 0
          ? placementPool[(part - 1) % placementPool.length].peerId
          : "tracker-fallback";

      const trackerResp = await forwardShardToTracker(shardName, chunk);
      shards.push({
        part,
        hash,
        size: chunk.length,
        server: trackerResp.filename,
        peer,
      });
    }
  } catch (err) {
    return res.status(502).json({ success: false, message: err.message, shards });
  }

  const manifest = {
    filename: fileName,
    size: buffer.length,
    chunkSize: CHUNK_SIZE,
    shardCount: shards.length,
    shards,
    placement: {
      strategy: healthy.length ? "healthy-only" : ranked.length ? "best-available" : "tracker-fallback",
      candidates: ranked.map((p) => ({ peerId: p.peerId, status: p.status, risk_score: p.risk_score })),
    },
    createdAt: new Date().toISOString(),
  };

  try {
    await fs.mkdir(MAP_DIR, { recursive: true });
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const mapPath = path.join(MAP_DIR, `${Date.now()}_${safeName}.map.json`);
    await fs.writeFile(mapPath, JSON.stringify(manifest, null, 2));
    manifest.mapFile = path.relative(path.resolve(__dirname, "..", "..", ".."), mapPath);
  } catch (err) {
    console.warn("[upload] manifest write failed:", err.message);
  }

  res.json({ success: true, data: manifest });
});

export default router;
