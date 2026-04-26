import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NODE2IDX = path.resolve(__dirname, "..", "..", "..", "ml", "node2idx.json");

let knownPeers = null;

async function loadKnownPeers() {
  if (knownPeers) return knownPeers;
  try {
    const raw = await fs.readFile(NODE2IDX, "utf8");
    knownPeers = Object.keys(JSON.parse(raw));
  } catch {
    knownPeers = [];
  }
  return knownPeers;
}

export async function assignPeerId(UserModel) {
  const pool = await loadKnownPeers();

  if (pool.length > 0) {
    const taken = new Set(
      (await UserModel.find({ peerId: { $in: pool } }, "peerId").lean()).map((u) => u.peerId)
    );
    const free = pool.find((p) => !taken.has(p));
    if (free) return free;
  }

  return `peer_${Math.random().toString(36).slice(2, 8)}`;
}
