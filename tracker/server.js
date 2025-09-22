const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
const dotenv=require('dotenv')
dotenv.config()
const app = express();
app.use(cors());
app.use(bodyParser.json());
// Configure static files
app.use(express.static(__dirname));

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

const upload = multer({ dest: "uploads/" });

// --- Track online peers ---
const peers = {}; // { peerId: lastSeen }
const TIMEOUT = 15000; // 15 seconds offline timeout

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
// Peer heartbeat/register
app.post("/heartbeat", (req, res) => {
  const { peerId } = req.body;
  if (!peerId) return res.status(400).json({ error: "peerId required" });
  peers[peerId] = Date.now();
  res.json({ ok: true });
});
app.post('/register',(req,res)=>{
  const {peerId}=req.body;
  if(!peerId) return res.status(400).json({error:"peerId required"});
  peers[peerId]=Date.now();
  console.log('peer registered')
  res.json({ok:true});
})
// Get online peer count
app.get("/peers", (req, res) => {
  const now = Date.now();
  const onlinePeers = Object.entries(peers)
    .filter(([_, lastSeen]) => now - lastSeen <= TIMEOUT)
    .map(([id]) => id);
  res.json({ count: onlinePeers.length, online: onlinePeers });
});

// Upload file
app.post("/upload", upload.single("file"), (req, res) => {
  const uniquename=req.file.originalname;
  const destPath = `uploads/${uniquename}`;
  fs.renameSync(req.file.path, destPath);
  console.log(`File uploaded: ${req.file.originalname}`);
  res.json({ ok: true, filename: uniquename });
});

// Download file
app.get("/files/:filename", (req, res) => {
  const path = `uploads/${req.params.filename}`;
  if (fs.existsSync(path)) {
    res.download(path);
  } else {
    res.status(404).json({ error: "File not found" });
  }
});

// Cleanup offline peers every 10 seconds
setInterval(() => {
  const now = Date.now();
  for (const id in peers) {
    if (now - peers[id] > TIMEOUT) {
      console.log(`${id} timed out`);
      delete peers[id];
    }
  }
}, 10000);
const address=process.env.ADDRESS
const port=process.env.PORT
app.listen(port,address, () => console.log(`Server running on http://${address}:${port}`));
