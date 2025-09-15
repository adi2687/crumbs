// Install: npm install express body-parser dotenv
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 7000; // Render sets PORT dynamically
const peers = {}; // { peerId: { address, lastSeen } }
const TIMEOUT = 15000; // 15 seconds

// POST register
app.post("/register", (req, res) => {
  const { peerId, address } = req.body;
  if (!peerId || !address)
    return res.status(400).send("Missing peerId or address");
  peers[peerId] = { address, lastSeen: Date.now() };
  console.log(`${peerId} registered at ${address}`);
  res.json({ ok: true });
});

// GET register (for testing from browser/phone)
app.get("/register", (req, res) => {
  const peerId = req.query.peerId;
  const address = req.query.address;
  if (!peerId || !address) {
    return res.status(400).send("Missing peerId or address");
  }
  peers[peerId] = { address, lastSeen: Date.now() };
  console.log(`${peerId} registered at ${address}`);
  res.send("Register done");
});

// Heartbeat
app.post("/heartbeat", (req, res) => {
  const { peerId } = req.body;
  if (peers[peerId]) peers[peerId].lastSeen = Date.now();
  res.json({ ok: true });
});

// List peers
app.get("/peers", (req, res) => {
  const now = Date.now();
  const online = Object.entries(peers)
    .filter(([_, p]) => now - p.lastSeen <= TIMEOUT)
    .map(([id, p]) => ({ peerId: id, address: p.address }));
  res.json(online);
});

// Cleanup loop
setInterval(() => {
  const now = Date.now();
  for (const id in peers) {
    if (now - peers[id].lastSeen > TIMEOUT) {
      console.log(`${id} timed out`);
      delete peers[id];
    }
  }
}, 5000);

// Root test
app.get("/", (req, res) => {
  res.send("This is the tracker ✅");
});

// Start server
app.listen(port, "0.0.0.0", () => {
  console.log(`Tracker running on port ${port}`);
});
