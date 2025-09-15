// Install: npm install express body-parser
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const peers = {}; // { peerId: { address, lastSeen } }
const TIMEOUT = 15000; // 15 seconds

// Register a peer
app.post("/register", (req, res) => {
  const { peerId, address } = req.body;
  if (!peerId || !address) return res.status(400).send("Missing peerId or address");
  peers[peerId] = { address, lastSeen: Date.now() };
  console.log(`${peerId} registered at ${address}`);
  res.json({ ok: true });
});

// Receive heartbeat
app.post("/heartbeat", (req, res) => {
  const { peerId } = req.body;
  if (peers[peerId]) peers[peerId].lastSeen = Date.now();
  res.json({ ok: true });
});

// List online peers
app.get("/peers", (req, res) => {
  const now = Date.now();
  const online = Object.entries(peers)
    .filter(([_, p]) => now - p.lastSeen <= TIMEOUT)
    .map(([id, p]) => ({ peerId: id, address: p.address }));
  res.json(online);
});

// Remove offline peers periodically
setInterval(() => {
  const now = Date.now();
  for (const id in peers) {
    if (now - peers[id].lastSeen > TIMEOUT) {
      console.log(`${id} timed out`);
      delete peers[id];
    }
  }
}, 5000);

app.listen(7000, () => console.log("Tracker running on http://localhost:7000"));
