# CRUMBS — Decentralized Cloud Storage Network
### Full Project Documentation

---

## Table of Contents

1. [What is CRUMBS?](#1-what-is-crumbs)
2. [How the System Works (Big Picture)](#2-how-the-system-works-big-picture)
3. [Project Folder Structure](#3-project-folder-structure)
4. [Module Breakdown](#4-module-breakdown)
   - 4.1 [Tracker Server](#41-tracker-server--trackerserverjs)
   - 4.2 [Peer Client](#42-peer-client--trackerpeerjs)
   - 4.3 [Sharding Engine](#43-sharding-engine--trackershardingjs)
   - 4.4 [Compression Module](#44-compression-module--compressionmainjs)
   - 4.5 [ML — Node Failure Prediction](#45-ml--node-failure-prediction-ml)
   - 4.6 [Website Backend](#46-website-backend--websitebackend)
   - 4.7 [Website Frontend](#47-website-frontend--websitefrontendsrc)
5. [API Reference](#5-api-reference)
6. [Technology Stack](#6-technology-stack)
7. [Data Flow Diagrams](#7-data-flow-diagrams)
8. [Key Algorithms Explained](#8-key-algorithms-explained)
9. [ML Model — Deep Dive](#9-ml-model--deep-dive)
10. [Frontend Pages & Routes](#10-frontend-pages--routes)
11. [Auth & Security](#11-auth--security)
12. [What Is Done vs. Planned](#12-what-is-done-vs-planned)

---

## 1. What is CRUMBS?

**CRUMBS** (shorthand for the token symbol **CRB**) is a **peer-to-peer decentralized cloud storage network**. Instead of renting servers from AWS or Google Cloud, CRUMBS turns idle smartphones (and any internet-connected device) into storage nodes. Users who contribute storage earn **CRB tokens**, while those who upload files pay tokens to store their data across the network.

**Core ideas:**
- Files are **sharded** (split) into 100 KB chunks before uploading, so no single peer holds your whole file.
- Each shard is hashed with **SHA-256** to guarantee integrity.
- A **GRU-based ML model** predicts which peers are about to go offline so shards can be migrated proactively.
- An **image compression pipeline** (Node.js + Sharp) shrinks files by ~92% before they hit the network.

---

## 2. How the System Works (Big Picture)

```
User uploads file
       │
       ▼
  Compression (Sharp)          ← shrink the file first (~92% reduction)
       │
       ▼
  Sharding Engine              ← split into 100 KB chunks, SHA-256 each
       │
       ▼
  Tracker Server               ← receive shards, store in /uploads
       │
       ├──► Peer A stores shard_1
       ├──► Peer B stores shard_2
       └──► Peer C stores shard_3

Peer heartbeats ──► ML Model ──► predict offline risk ──► re-shard if needed

User downloads file
       │
       ▼
  Tracker fetches all shards → merges → returns original file
```

---

## 3. Project Folder Structure

```
assignemnts/                       ← root
├── tracker/                       ← P2P tracker server (core backend)
│   ├── server.js                  ← Express server: peer registry, file upload/download
│   ├── peer.js                    ← Peer client: heartbeat, upload, download
│   ├── sharding.js                ← Sharding + upload/download/merge logic
│   ├── sharding_join.js           ← Standalone shard merge utility
│   └── uploads/                   ← Uploaded shards stored here
│
├── compression/                   ← Image compression utilities
│   ├── main.js                    ← Sharp-based compression (JPG/PNG/WebP)
│   ├── testee.py                  ← Python compression tests
│   ├── compressed/                ← Output of compressed files
│   └── ml/                        ← ML-based compression experiments
│
├── hashing/                       ← SHA-256 hashing utilities (Python)
│
├── sharding/                      ← Standalone sharding module
│   ├── main.js                    ← Split file into shards
│   └── join.js                    ← Reconstruct from shards
│
├── ml/                            ← Machine Learning — peer failure prediction
│   ├── model.py                   ← GRU model training (Google Colab)
│   ├── predict.py                 ← Run predictions from live heartbeat logs
│   ├── logs.py                    ← Log utilities
│   ├── model.pt                   ← Trained PyTorch model weights
│   ├── scaler.pkl                 ← MinMaxScaler saved from training
│   ├── node2idx.json              ← Peer ID → index mapping
│   ├── loss_curve.png             ← Training curve visualization
│   └── logs/                      ← Live heartbeat JSONL logs
│
├── website/
│   ├── frontend/                  ← React + Vite + TailwindCSS web app
│   │   └── src/
│   │       ├── App.jsx            ← Router + auth guard
│   │       ├── main.jsx           ← Entry point
│   │       └── assets/components/ ← All UI pages (16 components)
│   └── backend/                   ← Express + MongoDB auth/user/storage API
│       ├── server.js              ← Main server with rate limiting + Helmet
│       ├── routes/                ← API route handlers
│       ├── controllers/           ← Business logic
│       ├── models/                ← Mongoose schemas
│       ├── middleware/            ← Auth middleware (JWT)
│       └── services/mlBridge.js  ← Bridges Node.js backend → Python ML
│
├── device.js                      ← Device fingerprinting (MAC hash → peer ID)
├── mainserver.js                  ← Root server entry
├── mainpeer.js                    ← Root peer entry
├── main.js                        ← General entry
└── package.json                   ← Root dependencies
```

---

## 4. Module Breakdown

### 4.1 Tracker Server — `tracker/server.js`

The **heart of the P2P network**. It is an Express.js HTTP server that:

| What it does | How |
|---|---|
| Accepts peer registration | `POST /register` — stores `peerId` with current timestamp |
| Receives heartbeats | `POST /heartbeat` — updates last-seen time, logs to JSONL for ML |
| Returns online peer list | `GET /peers` — filters peers seen within 15 seconds |
| Accepts shard uploads | `POST /upload` — Multer stores file in `uploads/` |
| Serves shard downloads | `GET /files/:filename` — streams file from `uploads/` |
| Cleans dead peers | `setInterval` every 10s removes peers not seen in 15s |

**Heartbeat logging** (for ML training):
Every heartbeat writes a JSONL record:
```json
{ "peerId": "peer-A3F2", "missedCount": 0, "latencyMs": 42, "day": 6, "hour": 14, "label": 0 }
```
- `label: 0` = online, `label: 1` = offline (missed ≥ 3 heartbeats)
- This data is what the GRU ML model trains on.

**Config:**
- Port: `7000` (from `.env`)
- Peer timeout: **15 seconds**
- Cleanup interval: **10 seconds**

---

### 4.2 Peer Client — `tracker/peer.js`

A Node.js script that **simulates a peer node**. Each peer:

1. **Registers** itself with the tracker on startup.
2. **Sends a heartbeat** every **5 seconds** including:
   - `peerId` — unique device identifier
   - `missedCount` — how many consecutive heartbeats failed
   - `latencyMs` — round-trip time of last heartbeat
   - `day`, `hour` — time context (used by ML model)
3. Can **upload files** to the tracker: `uploadFile(filePath)`
4. Can **download files** from the tracker: `downloadFile(filename, savePath)`
5. Can **query online peers**: `getOnlinePeers()`

The peer ID defaults to `peer-A3F2` (or is set via `PEER_ID` env var).

---

### 4.3 Sharding Engine — `tracker/sharding.js`

Implements the **split → upload → download → merge** pipeline:

**Splitting a file:**
```
Read file in 100 KB chunks
  │
  ├── For each chunk:
  │     ├── Compute SHA-256 hash of chunk bytes
  │     ├── Save chunk as:  filename.{hash}.part{N}
  │     └── Add to shard list
  │
  └── Upload each shard to tracker via multipart POST /upload
        └── Delete local shard copy after upload
        └── Save shard map: filename.map.json
```

**`filename.map.json` example:**
```json
[
  { "hash": "a1b2c3...", "serverFile": "aryan.png.a1b2c3....part1" },
  { "hash": "d4e5f6...", "serverFile": "aryan.png.d4e5f6....part2" }
]
```

**Merging a file:**
```
Read filename.map.json
  │
  └── For each shard entry:
        ├── GET /files/{serverFile} → download shard
        ├── Write chunk bytes to output stream
        └── Delete temp shard file
        └── Output: merged_{filename}
```

- Chunk size: **100 KB**
- Integrity: **SHA-256** per chunk
- Server: configurable via `address` + `port` constants

---

### 4.4 Compression Module — `compression/main.js`

Uses the **Sharp** library (Node.js) to compress images before they are sharded.

**Supported formats and compression settings:**

| Format | Method | Quality |
|---|---|---|
| `.jpg` / `.jpeg` | MozJPEG | 70% (configurable) |
| `.png` | PNG optimizer | 70% |
| `.webp` | WebP encoder | 70% |

**Result:** Average **92.1% storage reduction** — e.g., a 10 MB PNG becomes ~0.8 MB.

Usage:
```js
await compressImage("photo.png", "photo_compressed.jpg", 70);
```

The `testee.py` in `compression/` runs Python-side compression tests and benchmarks against various quality settings. Results are saved to `results.txt`.

---

### 4.5 ML — Node Failure Prediction (`ml/`)

This is one of the most advanced parts of the project. It predicts **which peer nodes will go offline** using a **GRU (Gated Recurrent Unit) neural network** trained on real heartbeat data.

#### What problem does it solve?
If a peer is about to go offline, its shards need to be copied to another peer *before* it dies — otherwise that data is lost. The ML model gives an early warning.

#### Training (`model.py`) — runs on Google Colab

**Architecture: `NodeFailureGRU`**
```
Input: sequence of 48 heartbeat records per peer
  Each record: [missedCount, latencyMs, day, hour]
       │
       ├── Peer Embedding (8-dim): encodes which peer it is
       ├── Concatenate embedding with features → 12-dim input
       └── GRU (2 layers, hidden=64, dropout=0.2)
              └── Linear → sigmoid → risk score (0 to 1)
```

**Training config:**
| Parameter | Value |
|---|---|
| Sequence length | 48 heartbeats |
| Batch size | 32 |
| Epochs | 50 (early stop patience=5) |
| Learning rate | 0.0005 |
| Loss function | BCEWithLogitsLoss (pos_weight=5.0) |
| Optimizer | Adam |

**Labels:**
- `label = 1` if missed ≥ 3 heartbeats (offline)
- `label = 0` otherwise (online)

Artifacts saved after training:
- `model.pt` — PyTorch model weights
- `scaler.pkl` — MinMaxScaler for feature normalization
- `node2idx.json` — maps peer ID strings to integer indices
- `loss_curve.png` — training vs validation loss chart

#### Inference (`predict.py`) — runs live on the server

Reads the live `logs/heartbeats.jsonl` file collected by the tracker server, then for each peer:

1. Loads last 48 heartbeat records
2. Normalizes features with saved `scaler.pkl`
3. Runs the GRU model
4. Outputs:
   - `risk_score`: 0.0–1.0
   - `status`: `HEALTHY` / `MEDIUM` / `HIGH RISK`
   - `uptime_pct`: historical uptime %
   - `danger_hours`: hours of day when peer is most likely offline

Output saved to `logs/predictions.json`.

**Risk thresholds:**
| Score | Status |
|---|---|
| > 0.7 | HIGH RISK |
| 0.3–0.7 | MEDIUM |
| < 0.3 | HEALTHY |

#### ML Bridge (`website/backend/services/mlBridge.js`)
The backend service that automatically runs `predict.py` on a schedule and exposes the results via `GET /api/predictions`.

---

### 4.6 Website Backend — `website/backend/`

A full **Express.js + MongoDB** REST API that powers authentication, user management, file storage, and ML predictions for the web dashboard.

#### Stack
- **Express.js** — HTTP framework
- **MongoDB + Mongoose** — user data, file metadata
- **JWT** — stateless authentication tokens
- **Helmet** — sets secure HTTP headers
- **express-rate-limit** — 100 requests / 15 minutes per IP
- **Cloudinary** — cloud image storage for profile pictures

#### API Routes

| Route | Method | Description |
|---|---|---|
| `/api/auth/...` | POST | Register, login, JWT token issuance |
| `/api/users/...` | GET/PUT | User profile management |
| `/api/upload` | POST | Upload file to Cloudinary (profile pics etc.) |
| `/api/upload/shards` | POST | Upload file shards into P2P network |
| `/api/settings` | GET/PUT | User settings (storage preferences etc.) |
| `/api/predictions` | GET | Fetch latest ML peer risk predictions |
| `/api/health` | GET | Health check endpoint |

#### Key directories
- `routes/` — thin route definitions, call controllers
- `controllers/` — business logic (CRUD, auth, file ops)
- `models/` — Mongoose schemas (User, File, etc.)
- `middleware/` — JWT auth guard applied to protected routes
- `services/mlBridge.js` — spawns Python ML process, polls for results

---

### 4.7 Website Frontend — `website/frontend/src/`

Built with **React 19 + Vite + TailwindCSS 4 + React Router 7**.

#### Authentication Guard (`App.jsx`)
- If a user has a `crumbs_token` in `localStorage`, they are redirected to `/profile`.
- If a user tries to access a protected route without a token, they are redirected to `/auth`.

**Protected routes:** `/profile`, `/analytics`, `/upload`, `/users`, `/settings`, `/demo`

#### All Pages / Components

| File | Route | Description |
|---|---|---|
| `landing.jsx` | `/` | Hero page, project intro, CTA |
| `auth.jsx` | `/auth` | Login + Register with JWT |
| `calculator.jsx` | `/calculator` | Storage cost savings calculator |
| `contact.jsx` | `/contact` | Contact form |
| `animations.jsx` | `/demo` | Interactive demo animations |
| `Join.jsx` | `/join` | Join the peer network page |
| `uploadbtn.jsx` | `/uploadbtn` | Simple file upload button component |
| `upload.jsx` | `/upload` | Full file upload page (protected) |
| `profile.jsx` | `/profile` | User dashboard — stats, storage, tokens (protected) |
| `users.jsx` | `/users` | Network peer list (protected) |
| `settings.jsx` | `/settings` | Account & storage settings (protected) |
| `nav.jsx` | (shared) | Navigation bar |
| `NotFound.jsx` | `*` | 404 page |
| `FuzzyText.jsx` | (shared) | Animated fuzzy text effect component |

**Styling:** TailwindCSS 4 with a terminal/cyberpunk aesthetic.

**Deployment:** Frontend deployed to **Vercel** (`vercel.json` present). Analytics via `@vercel/analytics`.

---

## 5. API Reference

### Tracker Server (`http://{ADDRESS}:7000`)

| Method | Path | Body / Params | Response |
|---|---|---|---|
| POST | `/register` | `{ peerId }` | `{ ok: true }` |
| POST | `/heartbeat` | `{ peerId, missedCount, latencyMs, day, hour }` | `{ ok: true }` |
| GET | `/peers` | — | `{ count: N, online: [...peerIds] }` |
| POST | `/upload` | `multipart/form-data: file` | `{ ok: true, filename }` |
| GET | `/files/:filename` | — | File download (stream) |

### Website Backend (`http://localhost:5000`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Get JWT token |
| GET | `/api/users/me` | JWT | Get own profile |
| POST | `/api/upload` | JWT | Upload to Cloudinary |
| POST | `/api/upload/shards` | JWT | Upload shards to P2P |
| GET | `/api/settings` | JWT | Get user settings |
| PUT | `/api/settings` | JWT | Update settings |
| GET | `/api/predictions` | JWT | Get ML risk predictions |
| GET | `/api/health` | No | Health check |

---

## 6. Technology Stack

### Backend / Core
| Technology | Version | Purpose |
|---|---|---|
| Node.js | — | Runtime |
| Express.js | 5.1.0 | HTTP framework |
| Multer | 2.0.2 | Multipart file uploads |
| Sharp | 0.34.3 | Image compression |
| axios | 1.12.2 | HTTP client (peer → tracker) |
| ws | 8.18.3 | WebSocket support |
| reed-solomon-erasure | 0.1.0 | Error correction coding |
| MongoDB / Mongoose | — | User & file metadata |
| JWT | — | Authentication tokens |
| Helmet | — | HTTP security headers |
| dotenv | 17.2.2 | Environment variables |
| geoip-lite | 1.4.10 | Geo IP for peer location |
| public-ip | 7.0.1 | Detect public IP of peer |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.1.1 | UI framework |
| Vite | 7.1.2 | Build tool / dev server |
| TailwindCSS | 4.1.13 | Utility-first CSS |
| React Router | 7.9.1 | Client-side routing |
| Lucide React | — | Icons |
| @vercel/analytics | — | Web analytics |

### Machine Learning
| Technology | Purpose |
|---|---|
| PyTorch | GRU model training & inference |
| NumPy | Numerical operations |
| scikit-learn | MinMaxScaler feature normalization |
| Matplotlib | Training curve plots |
| pickle | Save/load scaler |
| Python PIL | Image processing |

---

## 7. Data Flow Diagrams

### File Upload Flow
```
Browser (user)
    │  POST /api/upload/shards
    ▼
Website Backend (port 5000)
    │  Authenticate JWT
    │  Compress file (Sharp)
    │  Split into 100 KB shards (SHA-256 each)
    │  POST each shard to Tracker
    ▼
Tracker Server (port 7000)
    │  POST /upload → save to uploads/
    │  Return filename
    ▼
Website Backend
    │  Save shard map to MongoDB
    │  Return { ok, shardMap }
    ▼
Browser ← success response
```

### Peer Heartbeat + ML Prediction Flow
```
Peer Client (peer.js)
    │  POST /heartbeat every 5s
    ▼
Tracker Server
    │  Update peer last-seen timestamp
    │  Append to logs/heartbeats.jsonl
    ▼
mlBridge.js (runs predict.py on schedule)
    │  Load last 48 records per peer
    │  Normalize features (scaler.pkl)
    │  Run NodeFailureGRU model (model.pt)
    │  Write logs/predictions.json
    ▼
GET /api/predictions
    ▼
Frontend Dashboard (profile.jsx / users.jsx)
    └── Display risk scores, uptime %, danger hours
```

---

## 8. Key Algorithms Explained

### Sharding Algorithm
1. Open file as a read stream with `highWaterMark = 100 KB`
2. For each chunk emitted:
   - Hash chunk bytes: `SHA-256 → hex string`
   - Write chunk to disk: `{filename}.{hash}.part{N}`
   - Append `{ shardName, hash }` to shard list
3. Upload each shard via `multipart POST /upload`
4. Delete local shard copy
5. Write `{filename}.map.json` with `[{ hash, serverFile }]`

### Merge Algorithm
1. Read `{filename}.map.json`
2. Open output write stream: `merged_{filename}`
3. For each entry in the map:
   - `GET /files/{serverFile}` → stream → temp file
   - Copy temp file bytes into output stream
   - Delete temp file
4. Close write stream → original file is fully reconstructed

### Peer Timeout Algorithm
```
Every 10 seconds:
  For each peer in registry:
    if (now - peer.lastSeen > 15000ms):
      delete peer from registry
      log "peer timed out"
```

### Heartbeat Label Assignment (for ML)
```
if (missedCount >= 3):
  label = 1   // offline / at risk
else:
  label = 0   // online
```

---

## 9. ML Model — Deep Dive

### Model: `NodeFailureGRU`

```python
class NodeFailureGRU(nn.Module):
    embed  = nn.Embedding(num_nodes, 8)      # Per-peer identity vector
    gru    = nn.GRU(12, 64, 2, dropout=0.2)  # 4 features + 8 embed → hidden=64
    drop   = nn.Dropout(0.2)
    fc     = nn.Linear(64, 1)                # Binary classification output
```

**Input features per timestep:**

| Feature | Description |
|---|---|
| `missedCount` | How many consecutive heartbeats this peer missed |
| `latencyMs` | Round-trip time of last successful heartbeat |
| `day` | Day of week (0=Sunday … 6=Saturday) |
| `hour` | Hour of day (0–23) |

**Why these features?**
- `missedCount` is the strongest signal (directly indicates connectivity)
- `latencyMs` tracks degradation before full dropout
- `day` + `hour` captures **time-of-day patterns** (e.g., a phone node always goes offline at 2am when charging)

**Trained output:**
- PASS tests: Node sending `[[3, 7000, 5, 2]] * 1000` (worst-case missed heartbeats) scores **> 0.7** (HIGH RISK) ✓

### Feature normalization
All 4 features are normalized with `MinMaxScaler` fitted on the training data. Scaler is saved to `scaler.pkl` for use at inference time.

---

## 10. Frontend Pages & Routes

| Route | Auth Required | What the user sees |
|---|---|---|
| `/` | No | Landing page: hero, features, how it works, CTA buttons |
| `/calculator` | No | Interactive slider: input file size → see cost savings vs AWS |
| `/contact` | No | Contact form with email/message fields |
| `/join` | No | How to join the peer network, prerequisites |
| `/auth` | No | Login / Register toggle form with JWT |
| `/demo` | Yes | Animated demo showing file sharding in action |
| `/profile` | Yes | Personal dashboard: CRB tokens, storage used, peer status, ML risk |
| `/upload` | Yes | Drag-and-drop file upload → triggers compress → shard → upload |
| `/users` | Yes | Network peer list with real-time online status from `GET /peers` |
| `/settings` | Yes | Account settings, storage preferences, danger zone (delete account) |
| `*` | No | 404 NotFound page |

---

## 11. Auth & Security

| Feature | Implementation |
|---|---|
| **Authentication** | JWT tokens stored in `localStorage` as `crumbs_token` |
| **Route protection** | Client-side redirect in `App.jsx` useEffect; server-side JWT middleware |
| **Rate limiting** | 100 requests per 15 minutes per IP (express-rate-limit) |
| **HTTP security** | Helmet.js sets Content-Security-Policy, X-Frame-Options, etc. |
| **Device identity** | MAC address hashed → unique `peerId` (privacy-preserving) |
| **Data integrity** | SHA-256 hash per shard verified on download |
| **CORS** | Configured to allow frontend origin only |

---

## 12. What Is Done vs. Planned

### ✅ Done (Functional Prototype)

- [x] Peer registration and heartbeat system (5s interval, 15s timeout)
- [x] File sharding into 100 KB chunks with SHA-256 integrity
- [x] Shard upload/download via tracker server REST API
- [x] Shard map (`.map.json`) for exact file reconstruction
- [x] File merge/reconstruction from shards
- [x] Image compression with Sharp (JPG/PNG/WebP, ~92% reduction)
- [x] Heartbeat logging to JSONL for ML training
- [x] GRU neural network trained on heartbeat sequences
- [x] Per-peer risk scoring (HEALTHY / MEDIUM / HIGH RISK)
- [x] Uptime % and danger hour computation per peer
- [x] ML predictions served via REST API
- [x] Full web app with auth (JWT), user profiles, dashboard
- [x] File upload through web UI → compress → shard → P2P
- [x] Peer network list with online status
- [x] Settings page and user account management
- [x] Frontend deployed to Vercel

### 🔲 Planned / Future Work

- [ ] **End-to-end encryption** — encrypt shards before upload, decrypt on merge
- [ ] **Blockchain integration** — real CRB token economy on-chain
- [ ] **Mobile application** — native iOS/Android peer node app
- [ ] **Redundancy system** — auto-replicate shards when a HIGH RISK peer is detected
- [ ] **Real-time shard distribution optimization** — route shards to healthiest peers
- [ ] **Reed-Solomon erasure coding** — recover from peer loss without full re-upload
- [ ] **RealESRGAN upscaling** — restore compressed images at download time (Python ML)
- [ ] **Advanced compression ML** — neural codec beyond Sharp for non-image files

---

*Created by: Aditya Kurani | Project: CRUMBS | Year: 2025*
