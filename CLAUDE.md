# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CRUMBS** - A decentralized cloud storage network with peer-to-peer file distribution, smart sharding, and image compression. Files are split into 100KB shards with SHA-256 integrity verification and distributed across a peer network.

## Commands

### Frontend (React + Vite)
```bash
cd website/frontend
npm run dev        # Start dev server on 0.0.0.0:5173
npm run build      # Production build → dist/
npm run preview    # Preview production build
npm run lint       # ESLint check
```

### Backend (Tracker Server)
```bash
# From repo root
node tracker/server.js    # Start tracker/API server on PORT 7000
nodemon tracker/server.js # With auto-reload
```

### Peer Client
```bash
node tracker/peer.js      # Start a peer node (registers with tracker, sends heartbeat every 5s)
```

### Utilities
```bash
node sharding/main.js     # Split a file into shards
node sharding/join.js     # Merge shards back into original file
node compression/main.js  # Compress images via Sharp (quality=70)
python hashing/hashing.py # SHA-256 hash a file
```

## Environment Variables

**Root `.env`** (used by backend):
- `PORT=7000` — tracker server port
- `ADDRESS=192.168.137.249` — server IP (LAN address)

**`website/frontend/.env`** (used by Vite frontend):
- `VITE_BACKEND_PORT=7000`
- `VITE_BACKEND_ADDRESS=192.168.137.249`

Both `.env` files must be kept in sync when changing the server address/port.

## Architecture

### Auth & Routing (Frontend)

`App.jsx` wraps all routes in `AppWrapper`, which enforces auth on every navigation:
- **Protected routes**: `/profile`, `/analytics`, `/upload`, `/users`, `/settings` — redirect to `/auth` if no token.
- **Auth redirect**: if a token exists and user visits `/`, they're redirected to `/profile`.
- Auth state is stored in `localStorage` under keys `crumbs_token` and `crumbs_user` (JSON).
- `profile.jsx` and `settings.jsx` read both keys on mount; invalid/missing data redirects to `/auth`.
- Network stats shown in `/profile` and `/auth` are **simulated** (fake random increments every 3s) — no real backend data.

### Routes
| Path | Component | Auth Required |
|------|-----------|---------------|
| `/` | Landing | No |
| `/auth` | CrumbsAuth | No |
| `/profile` | Profile | Yes |
| `/settings` | SettingsPage | Yes |
| `/upload` | UploadPage | Yes |
| `/users` | UsersPage | Yes |
| `/analytics` | Vercel Analytics | Yes |
| `/calculator` | Calculator | No |
| `/contact` | Contact | No |
| `/join` | Joinnet | No |
| `/demo` | Demo (animations) | No |

### Backend (`tracker/`)
- **`server.js`** — Express 5 server. Handles peer registration, heartbeats, file upload/download. Peers time out after 15s; cleanup runs every 10s.
- **`peer.js`** — Peer client. Registers with tracker, sends heartbeat every 5s, exposes `uploadFile()` / `downloadFile()` / `getOnlinePeers()`.
- **`sharding.js`** — Splits files into 100KB shards. Each shard is named `${filename}.${sha256hash}.part${n}`. Writes a `${filename}.map.json` describing all shards for reconstruction.
- **`sharding_join.js`** — Reads the map JSON and reassembles shards into the original file.

### Frontend (`website/frontend/src/`)
- **`App.jsx`** — React Router v7 routes + `AppWrapper` auth guard.
- **`assets/components/`** — Page-level JSX components.
- **`Hooks/navigations.jsx`** — `useNavigation` hook wrapping React Router's `useNavigate`.
- **`Hooks/onlineusers.jsx`** — `UsersOnline` hook polling `/peers` every 5s for live peer count.

### Other Modules
- **`compression/main.js`** — Sharp-based image compression.
- **`compression/ml/main.py`** — RealESRGAN upscaling (Python, planned enhancement).
- **`hashing/hashing.py`** — SHA-256 file integrity hashing.
- **`device.js`** — Collects and hashes MAC addresses (with salt) and reports to remote server.

### API Endpoints (tracker/server.js)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/register` | Register peer with `{ peerId }` |
| POST | `/heartbeat` | Peer keepalive with `{ peerId }` |
| GET | `/peers` | Returns online peer list and count |
| POST | `/upload` | Multipart file upload (multer) → `uploads/` |
| GET | `/files/:filename` | Download file from `uploads/` |

Note: `UploadPage` (`/upload` route) POSTs base64 to `/api/upload/uploadImage` — this endpoint is **not in `tracker/server.js`** and appears to target a separate backend service.

### Key Design Decisions
- Shards are uploaded to the tracker server's `/upload` endpoint and tracked via the map JSON — there is no true DHT yet.
- Peer identity uses `peer_${random 0–1000}` — collisions are possible in testing.
- Frontend polls `/peers` every 5s via the `UsersOnline` hook for the live counter.
- Reed-Solomon error correction is a declared dependency (`reed-solomon`, `reed-solomon-erasure` in root `node_modules`) but integration is in-progress.
- The `SettingsPage` save actions are stubbed — `handleSave()` simulates a 1s delay but makes no actual API calls.
