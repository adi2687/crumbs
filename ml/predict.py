import json
import pickle
import numpy as np
import torch
import torch.nn as nn
from pathlib import Path

import os
print(f'Running from   : {os.getcwd()}')
print(f'Log path       : {os.path.abspath("logs/heartbeats.jsonl")}')
print(f'File exists    : {os.path.exists("logs/heartbeats.jsonl")}')
print(f'File size      : {os.path.getsize("logs/heartbeats.jsonl")} bytes')

# count lines
with open("logs/heartbeats.jsonl") as f:
    lines = sum(1 for l in f)
print(f'Total lines    : {lines:,}')

# print first record
with open("logs/heartbeats.jsonl") as f:
    print(f'First record   : {f.readline().strip()}')

# ─────────────────────────────────────────
# 1. GRU MODEL — must match train.py exactly
# ─────────────────────────────────────────
class NodeFailureGRU(nn.Module):
    def __init__(self, num_nodes, emb_dim, input_features, hidden, layers, dropout):
        super().__init__()
        self.embed = nn.Embedding(num_nodes, emb_dim)
        self.gru   = nn.GRU(
            input_size  = input_features + emb_dim,
            hidden_size = hidden,
            num_layers  = layers,
            dropout     = dropout if layers > 1 else 0,
            batch_first = True
        )
        self.drop = nn.Dropout(dropout)
        self.fc   = nn.Linear(hidden, 1)

    def forward(self, x, nidx):
        ev     = self.embed(nidx).unsqueeze(1).expand(-1, x.size(1), -1)
        x      = torch.cat([x, ev], dim=-1)
        out, _ = self.gru(x)
        return self.fc(self.drop(out[:, -1, :])).squeeze(-1)

# ─────────────────────────────────────────
# 2. CONFIG — must match train.py exactly
# ─────────────────────────────────────────
CONFIG = {
    'embedding_dim':   8,
    'hidden_size':     64,
    'num_layers':      2,
    'dropout':         0.2,
    'sequence_length': 48,
}

# ─────────────────────────────────────────
# 3. LOAD model + scaler + node2idx
# ─────────────────────────────────────────
BASE   = Path(__file__).parent
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

with open(BASE / 'scaler.pkl',    'rb') as f: scaler   = pickle.load(f)
with open(BASE / 'node2idx.json', 'r')  as f: node2idx = json.load(f)

model = NodeFailureGRU(
    num_nodes      = len(node2idx),
    emb_dim        = CONFIG['embedding_dim'],
    input_features = 4,
    hidden         = CONFIG['hidden_size'],
    layers         = CONFIG['num_layers'],
    dropout        = CONFIG['dropout'],
).to(device)

model.load_state_dict(torch.load(BASE / 'model.pt', map_location=device))
model.eval()
print(f'Model loaded — {len(node2idx)} known nodes')

# ─────────────────────────────────────────
# 4. LOAD last N heartbeats per node
def load_recent_heartbeats(log_path, seq_len):
    from collections import defaultdict
    node_records = defaultdict(list)

    with open(log_path, 'r') as f:
        content = f.read().strip()

    # handle both formats — JSON array and JSONL
    if content.startswith('['):
        # JSON array format  ← your file
        records = json.loads(content)
        for r in records:
            node_records[r['peerId']].append(r)
    else:
        # JSONL format — one record per line
        for line in content.splitlines():
            line = line.strip().rstrip(',')  # handle trailing commas
            if not line or line in ['[', ']']:
                continue
            try:
                r = json.loads(line)
                node_records[r['peerId']].append(r)
            except:
                continue

    # keep only last seq_len records per node
    result = {}
    for pid, recs in node_records.items():
        if len(recs) >= seq_len:
            result[pid] = recs[-seq_len:]
        else:
            print(f'  skipping {pid} — only {len(recs)} records, need {seq_len}')

    return result

# ─────────────────────────────────────────
# 5. PREDICT risk score for one node
# ─────────────────────────────────────────
def predict_node(pid, records):
    """
    Takes peerId + list of seq_len heartbeat records
    Returns risk score 0-1
    """
    if pid not in node2idx:
        print(f'  unknown node {pid} — not in node2idx, skipping')
        return None

    feats = np.array([
        [r['missedCount'], r['latencyMs'], r['day'], r['hour']]
        for r in records
    ], dtype=np.float32)

    feats = scaler.transform(feats)

    X  = torch.tensor(feats, dtype=torch.float32).unsqueeze(0).to(device)
    ni = torch.tensor([node2idx[pid]], dtype=torch.long).to(device)

    with torch.no_grad():
        score = torch.sigmoid(model(X, ni)).item()

    return round(score, 3)

# ─────────────────────────────────────────
# 6. COMPUTE uptime % for one node
# ─────────────────────────────────────────
def compute_uptime(all_records):
    """
    Uses full history (not just last 48)
    uptime = online ticks / total ticks
    """
    if not all_records:
        return 0.0
    total  = len(all_records)
    online = sum(1 for r in all_records if r['label'] == 0)
    return round(online / total * 100, 1)

# ─────────────────────────────────────────
# 7. COMPUTE danger hours for one node
# ─────────────────────────────────────────
def compute_danger_hours(all_records, threshold=0.4):
    """
    For each hour 0-23, compute offline rate
    Returns list of hours where offline rate > threshold
    """
    from collections import defaultdict
    hour_stats = defaultdict(lambda: {'total': 0, 'offline': 0})

    for r in all_records:
        h = r['hour']
        hour_stats[h]['total']   += 1
        hour_stats[h]['offline'] += r['label']

    danger = []
    for h in range(24):
        s = hour_stats[h]
        if s['total'] > 0:
            rate = s['offline'] / s['total']
            if rate > threshold:
                danger.append(h)

    return danger

# ─────────────────────────────────────────
# 8. MAIN — run predictions for all nodes
# ─────────────────────────────────────────
def run_predictions(log_path='logs/heartbeats.jsonl',
                    out_path='logs/predictions.json'):

    from collections import defaultdict

    # load all records for uptime + danger hours
    all_records = defaultdict(list)
    with open(log_path, 'r') as f:
        content = f.read().strip()

    if content.startswith('['):
        records = json.loads(content)
    else:
        records = []
        for line in content.splitlines():
            line = line.strip().rstrip(',')
            if not line or line in ['[', ']']:
                continue
            try:
                records.append(json.loads(line))
            except:
                continue
    for r in records:
        all_records[r['peerId']].append(r)
    # load recent records for GRU input
    recent = load_recent_heartbeats(log_path, CONFIG['sequence_length'])

    predictions = {}

    for pid, recs in recent.items():
        risk    = predict_node(pid, recs)
        if risk is None:
            continue

        uptime  = compute_uptime(all_records[pid])
        danger  = compute_danger_hours(all_records[pid])

        # status label
        if risk > 0.7:
            status = 'HIGH RISK'
        elif risk > 0.3:
            status = 'MEDIUM'
        else:
            status = 'HEALTHY'

        predictions[pid] = {
            'risk_score':   risk,
            'uptime_pct':   uptime,
            'danger_hours': danger,
            'status':       status,
        }

    # sort by risk score descending
    predictions = dict(
        sorted(predictions.items(), key=lambda x: -x[1]['risk_score'])
    )

    # save to file
    with open(out_path, 'w') as f:
        json.dump(predictions, f, indent=2)

    # print results
    print(f"\n{'Node':<15} {'Risk':<8} {'Uptime':<10} {'Status':<12} {'Danger hours'}")
    print('-' * 65)
    for pid, p in predictions.items():
        hours = ', '.join(f'{h}:00' for h in p['danger_hours'][:3])
        if len(p['danger_hours']) > 3:
            hours += f" +{len(p['danger_hours'])-3} more"
        print(f"{pid:<15} {p['risk_score']:<8} {p['uptime_pct']:<10} {p['status']:<12} {hours}")

    print(f'\nSaved to {out_path}')
    return predictions

if __name__ == '__main__':
    run_predictions()