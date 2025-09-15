// peer.js
// Usage: node peer.js <peerId> <listenPort> <sharedFolder>
// Example: node peer.js peer1 9101 ./shared
// npm: npm install ws
const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const os = require("os");

if (process.argv.length < 5) {
  console.error("Usage: node peer.js <peerId> <listenPort> <sharedFolder>");
  process.exit(1);
}

const peerId = process.argv[2];
const listenPort = parseInt(process.argv[3], 10);
const sharedFolder = path.resolve(process.argv[4]);
const myAddress = `ws://localhost:${listenPort}`;
const TRACKER = "ws://localhost:9000";

// configuration
const CHUNK_SIZE = 64 * 1024; // 64KB per chunk

// state
const peers = {}; // peerId -> ws
const incomingFiles = {}; // filename -> { writeStream, expectedChunks, gotChunks, tmpPath }
const advertisedFiles = []; // list of filenames in shared folder

// read shared folder
function scanShared() {
  try {
    const files = fs.readdirSync(sharedFolder);
    advertisedFiles.length = 0;
    for (const f of files) {
      const p = path.join(sharedFolder, f);
      if (fs.statSync(p).isFile()) advertisedFiles.push(f);
    }
  } catch (e) {
    console.warn("Could not scan shared folder:", e.message);
  }
}

// compute sha256 of a file
function sha256File(p) {
  return new Promise((res, rej) => {
    const hash = crypto.createHash("sha256");
    const rs = fs.createReadStream(p);
    rs.on("data", (b) => hash.update(b));
    rs.on("end", () => res(hash.digest("hex")));
    rs.on("error", rej);
  });
}

// create my WebSocket server for incoming P2P connections
const wss = new WebSocket.Server({ port: listenPort });
wss.on("connection", (ws) => {
  console.log("Incoming P2P connection");
  setupPeerSocket(ws, null, true);
});

// connect to tracker
const tracker = new WebSocket(TRACKER);
tracker.on("open", () => {
  scanShared();
  tracker.send(JSON.stringify({ type: "register", peerId, address: myAddress, files: advertisedFiles }));
  console.log(`Connected to tracker as ${peerId} @ ${myAddress}`);
});

// handle index/whoHas results
tracker.on("message", (raw) => {
  const msg = JSON.parse(raw);
  if (msg.type === "index") {
    // index contains all peers and their files (we could use it to auto-connect)
    // For this example we just use tracker queries (whoHas)
    // console.log("Tracker index updated");
  } else if (msg.type === "whoHasResult") {
    if (msg.holders && msg.holders.length) {
      console.log(`Holders for ${msg.filename}:`, msg.holders.map(h => h.peerId).join(", "));
    } else {
      console.log(`No holders found for ${msg.filename}`);
    }
  }
});

// helper: connect direct to a peer address if not connected
function ensureConnected(peerInfo, cb) {
  if (peers[peerInfo.peerId]) {
    return cb && cb(null, peers[peerInfo.peerId]);
  }
  const ws = new WebSocket(peerInfo.address);
  ws.on("open", () => {
    console.log(`Direct connection to ${peerInfo.peerId} established`);
    peers[peerInfo.peerId] = ws;
    setupPeerSocket(ws, peerInfo.peerId, false);
    cb && cb(null, ws);
  });
  ws.on("error", (err) => {
    console.warn(`Failed to connect to ${peerInfo.peerId} @ ${peerInfo.address}:`, err.message);
    cb && cb(err);
  });
}

// setup handlers for a peer socket (incoming or outgoing)
function setupPeerSocket(ws, remoteId = null, acceptIdFromIntro = false) {
  let identifiedAs = remoteId;

  ws.on("message", async (raw, isBinary) => {
    // try parse JSON
    if (!isBinary) {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.type === "intro" && acceptIdFromIntro) {
          // remote tells us its id after connecting
          identifiedAs = msg.peerId;
          peers[identifiedAs] = ws;
          console.log(`Introduced: ${identifiedAs}`);
        }

        if (msg.type === "request-file") {
          // Someone is asking for a file: we stream it in chunks (base64 JSON chunks)
          const filename = msg.filename;
          const full = path.join(sharedFolder, filename);
          if (!fs.existsSync(full)) {
            ws.send(JSON.stringify({ type: "error", message: "file-not-found", filename }));
            return;
          }
          const stats = fs.statSync(full);
          const totalChunks = Math.ceil(stats.size / CHUNK_SIZE);
          const hash = await sha256File(full);

          // send metadata
          ws.send(JSON.stringify({ type: "file-meta", filename, size: stats.size, totalChunks, hash }));

          // stream chunks
          const rs = fs.createReadStream(full, { highWaterMark: CHUNK_SIZE });
          let idx = 0;
          rs.on("data", (chunk) => {
            idx++;
            ws.send(JSON.stringify({ type: "file-chunk", filename, index: idx, data: chunk.toString("base64") }));
          });
          rs.on("end", () => {
            ws.send(JSON.stringify({ type: "file-end", filename }));
            console.log(`Sent file ${filename} to ${msg.requester || identifiedAs || "peer"}`);
          });
          return;
        }

        if (msg.type === "file-meta") {
          // prepare receiver storage
          const tmp = path.join(os.tmpdir(), `${peerId}_${msg.filename}.part`);
          incomingFiles[msg.filename] = {
            tmpPath: tmp,
            expectedChunks: msg.totalChunks,
            gotChunks: 0,
            writeStream: fs.createWriteStream(tmp, { flags: "w" }),
            hash: msg.hash
          };
          console.log(`Receiving ${msg.filename} ${msg.size} bytes in ${msg.totalChunks} chunks`);
          return;
        }

        if (msg.type === "file-chunk") {
          // append base64 chunk
          const info = incomingFiles[msg.filename];
          if (!info) {
            console.warn("Got chunk for unknown file", msg.filename);
            return;
          }
          const buf = Buffer.from(msg.data, "base64");
          info.writeStream.write(buf);
          info.gotChunks++;
          if (info.gotChunks % 10 === 0 || info.gotChunks === info.expectedChunks) {
            console.log(`Progress ${msg.filename}: ${info.gotChunks}/${info.expectedChunks}`);
          }
          return;
        }

        if (msg.type === "file-end") {
          const info = incomingFiles[msg.filename];
          if (!info) return;
          info.writeStream.end(async () => {
            // verify hash
            const computed = await sha256File(info.tmpPath);
            if (computed === info.hash) {
              const dest = path.join(process.cwd(), `downloaded_${msg.filename}`);
              fs.renameSync(info.tmpPath, dest);
              console.log(`✔ Received and verified ${msg.filename} -> ${dest}`);
            } else {
              console.error(`✖ Hash mismatch for ${msg.filename} (expected ${info.hash}, got ${computed})`);
            }
            delete incomingFiles[msg.filename];
          });
          return;
        }

        if (msg.type === "hello") {
          console.log(`${msg.from} says: ${msg.text}`);
          return;
        }
      } catch (e) {
        // not JSON or error — ignore or print
        // console.log("Non-JSON message:", raw.toString());
      }
    }
  });

  ws.on("close", () => {
    if (identifiedAs && peers[identifiedAs] === ws) delete peers[identifiedAs];
    console.log(`Connection closed${identifiedAs ? " with " + identifiedAs : ""}`);
  });

  // when we initiate outbound connection, we should introduce ourselves
  if (!acceptIdFromIntro && !remoteId) {
    // nothing to do
  }
}

// CLI: request file from tracker+peer
const stdin = process.openStdin();
console.log("Commands:\n  list                -> show local shared files\n  whohas <name>       -> ask tracker who has file\n  get <name> <peerId> -> download file from peer\n  exit");
stdin.on("data", async (d) => {
  const line = d.toString().trim();
  const parts = line.split(/\s+/);
  if (parts[0] === "list") {
    scanShared();
    console.log("Shared files:", advertisedFiles.join(", "));
  } else if (parts[0] === "whohas" && parts[1]) {
    tracker.send(JSON.stringify({ type: "whoHas", filename: parts[1] }));
  } else if (parts[0] === "get" && parts[1] && parts[2]) {
    // ask tracker for peer info or use provided peerId
    const filename = parts[1];
    const targetPeerId = parts[2];

    // if we already have a connection -> request file
    if (peers[targetPeerId]) {
      peers[targetPeerId].send(JSON.stringify({ type: "request-file", filename, requester: peerId }));
      console.log(`Requested ${filename} from ${targetPeerId}`);
    }

    // otherwise ask tracker for target address (simple approach: ask tracker index and then connect)
    // We'll request full index by using whoHas and filtering for the peerId
    // For simplicity, we will first ask tracker for whoHas, get holders, find one that matches
    const asker = tracker;
    const msgId = Date.now() + "_" + Math.random();
    const handler = (raw) => {
      try {
        const m = JSON.parse(raw);
        if (m.type === "whoHasResult" && m.filename === filename) {
          // find requested peer
          const found = (m.holders || []).find(h => h.peerId === targetPeerId);
          if (!found) {
            console.log(`Tracker says peer ${targetPeerId} does not have ${filename}`);
            tracker.off("message", handler);
            return;
          }
          // connect and request
          ensureConnected(found, (err, ws) => {
            if (err) { tracker.off("message", handler); return; }
            // introduce ourselves (so acceptIdFromIntro peers can record our id)
            try { ws.send(JSON.stringify({ type: "intro", peerId })); } catch {}
            ws.send(JSON.stringify({ type: "request-file", filename, requester: peerId }));
            console.log(`Requested ${filename} from ${found.peerId}`);
            tracker.off("message", handler);
          });
        }
      } catch (e) {}
    };
    tracker.on("message", handler);
    tracker.send(JSON.stringify({ type: "whoHas", filename }));
  } else if (parts[0] === "exit") {
    process.exit(0);
  } else {
    console.log("Unknown command");
  }
});
