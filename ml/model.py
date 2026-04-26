import json
import pickle
import numpy as np
import torch
import torch.nn as nn
from collections import defaultdict
from torch.utils.data import Dataset, DataLoader
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import classification_report

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f'Device: {device}')

CONFIG = {
    'embedding_dim':   8,
    'hidden_size':     64,
    'num_layers':      2,
    'dropout':         0.2,
    'sequence_length': 48,
    'batch_size':      32,
    'epochs':          50,
    'learning_rate':   0.0005,
    'pos_weight':      5.0,
    'val_split':       0.2,
    'patience':        5,
}

records = []
with open('/content/heartbeats.json', 'r') as f:
    file_content = f.read()
    records = json.loads(file_content)

peers    = sorted(set(r['peerId'] for r in records))
print(peers)
node2idx = {p: i for i, p in enumerate(peers)}
print(f'Records: {len(records):,} | Nodes: {list(node2idx.keys())}')
hashmap={}
for r in records:
  if r["peerId"] not in hashmap:
    hashmap[r["peerId"]]=1
print(hashmap)

def build_sequences(records, node2idx, scaler=None, fit_scaler=False, seq_len=24):
    node_records = defaultdict(list)
    for r in records:
        node_records[r['peerId']].append(r)

    raw = np.array([[r['missedCount'], r['latencyMs'], r['day'], r['hour']]
                     for r in records], dtype=np.float32)
    if fit_scaler:
        scaler = MinMaxScaler()
        scaler.fit(raw)

    all_X, all_nidx, all_y = [], [], []
    for pid, recs in node_records.items():
        feats  = np.array([[r['missedCount'], r['latencyMs'], r['day'], r['hour']]
                            for r in recs], dtype=np.float32)
        labels = np.array([r['label'] for r in recs], dtype=np.float32)
        feats  = scaler.transform(feats)
        nidx   = node2idx[pid]
        for i in range(len(feats) - seq_len):
            all_X.append(feats[i:i+seq_len])
            all_nidx.append(nidx)
            all_y.append(labels[i+seq_len])

    X    = np.array(all_X,    dtype=np.float32)
    nidx = np.array(all_nidx, dtype=np.int64)
    y    = np.array(all_y,    dtype=np.float32)
    print(f'Sequences: {len(X):,} | Offline labels: {int(y.sum()):,}')
    return X, nidx, y, scaler

split         = int(len(records) * 0.8)
train_records = records[:split]
val_records   = records[split:]

X_tr, ni_tr, y_tr, scaler = build_sequences(train_records, node2idx, fit_scaler=True,  seq_len=CONFIG['sequence_length'])
X_va, ni_va, y_va, _      = build_sequences(val_records,   node2idx, scaler=scaler, fit_scaler=False, seq_len=CONFIG['sequence_length'])

class HeartbeatDataset(Dataset):
    def __init__(self, X, nidx, y):
        self.X    = torch.tensor(X,    dtype=torch.float32)
        self.nidx = torch.tensor(nidx, dtype=torch.long)
        self.y    = torch.tensor(y,    dtype=torch.float32)
    def __len__(self): return len(self.y)
    def __getitem__(self, i): return self.X[i], self.nidx[i], self.y[i]

train_loader = DataLoader(HeartbeatDataset(X_tr, ni_tr, y_tr), batch_size=CONFIG['batch_size'], shuffle=True)
val_loader   = DataLoader(HeartbeatDataset(X_va, ni_va, y_va), batch_size=CONFIG['batch_size'], shuffle=False)
print(f'Train batches: {len(train_loader)} | Val batches: {len(val_loader)}')

class NodeFailureGRU(nn.Module):
    def __init__(self, num_nodes, emb_dim, input_features, hidden, layers, dropout):
        super().__init__()
        self.embed   = nn.Embedding(num_nodes, emb_dim)
        self.gru     = nn.GRU(input_features + emb_dim, hidden, layers,
                              dropout=dropout if layers > 1 else 0, batch_first=True)
        self.drop    = nn.Dropout(dropout)
        self.fc      = nn.Linear(hidden, 1)

    def forward(self, x, nidx):
        ev  = self.embed(nidx).unsqueeze(1).expand(-1, x.size(1), -1)
        x   = torch.cat([x, ev], dim=-1)
        out, _ = self.gru(x)
        return self.fc(self.drop(out[:, -1, :])).squeeze(-1)

model = NodeFailureGRU(
    num_nodes      = len(node2idx),
    emb_dim        = CONFIG['embedding_dim'],
    input_features = 4,
    hidden         = CONFIG['hidden_size'],
    layers         = CONFIG['num_layers'],
    dropout        = CONFIG['dropout'],
).to(device)

total_params = sum(p.numel() for p in model.parameters())
print(f'Model ready | Parameters: {total_params:,}')
print(model)

optimizer = torch.optim.Adam(model.parameters(), lr=CONFIG['learning_rate'])
criterion = nn.BCEWithLogitsLoss(
    pos_weight=torch.tensor([CONFIG['pos_weight']]).to(device)
)

best_val_loss, patience_counter = float('inf'), 0
train_losses, val_losses = [], []

for epoch in range(1, CONFIG['epochs'] + 1):
    model.train()
    t_loss = 0
    for X, ni, y in train_loader:
        X, ni, y = X.to(device), ni.to(device), y.to(device)
        optimizer.zero_grad()
        loss = criterion(model(X, ni), y)
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        optimizer.step()
        t_loss += loss.item()

    model.eval()
    v_loss = 0
    with torch.no_grad():
        for X, ni, y in val_loader:
            X, ni, y = X.to(device), ni.to(device), y.to(device)
            v_loss += criterion(model(X, ni), y).item()

    t_loss /= len(train_loader)
    v_loss /= len(val_loader)
    train_losses.append(t_loss)
    val_losses.append(v_loss)

    print(f'Epoch {epoch:02d} | train: {t_loss:.4f} | val: {v_loss:.4f}', end='')

    if v_loss < best_val_loss:
        best_val_loss    = v_loss
        patience_counter = 0
        torch.save(model.state_dict(), '/content/model.pt')
        print(' ✓ saved')
    else:
        patience_counter += 1
        print(f' (patience {patience_counter}/{CONFIG["patience"]})')
        if patience_counter >= CONFIG['patience']:
            print(f'Early stopping at epoch {epoch}')
            break

import matplotlib.pyplot as plt
plt.figure(figsize=(8, 4))
plt.plot(train_losses, label='train loss')
plt.plot(val_losses,   label='val loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.title('CRUMBS GRU — training curve')
plt.legend()
plt.tight_layout()
plt.savefig('/content/loss_curve.png', dpi=120)
plt.show()

model.load_state_dict(torch.load('/content/model.pt'))
model.eval()
all_preds, all_labels = [], []
with torch.no_grad():
    for X, ni, y in val_loader:
        X, ni = X.to(device), ni.to(device)
        preds = (torch.sigmoid(model(X, ni)) > 0.5).cpu().numpy()
        all_preds.extend(preds)
        all_labels.extend(y.numpy())

print(classification_report(all_labels, all_preds, target_names=['online', 'offline']))

model.eval()
idx2node = {v: k for k, v in node2idx.items()}
results  = {}

node_records = defaultdict(list)
for r in val_records:
    node_records[r['peerId']].append(r)

for pid, recs in node_records.items():
    if len(recs) < CONFIG['sequence_length']:
        continue
    feats = np.array([[r['missedCount'], r['latencyMs'], r['day'], r['hour']]
                       for r in recs[-CONFIG['sequence_length']:]], dtype=np.float32)
    feats = scaler.transform(feats)
    X     = torch.tensor(feats, dtype=torch.float32).unsqueeze(0).to(device)
    ni    = torch.tensor([node2idx[pid]], dtype=torch.long).to(device)
    with torch.no_grad():
        risk = torch.sigmoid(model(X, ni)).item()
    uptime = (1 - sum(r['label'] for r in recs) / len(recs)) * 100
    results[pid] = {
        'risk_score': round(risk, 3),
        'uptime_pct': round(uptime, 1),
        'status':     'HIGH RISK' if risk > 0.7 else 'MEDIUM' if risk > 0.3 else 'HEALTHY'
    }

print('\nPer-node predictions:')
print(f'{"Node":<15} {"Risk":<10} {"Uptime":<10} {"Status"}')
print('-' * 45)
for pid, r in sorted(results.items(), key=lambda x: -x[1]['risk_score']):
    print(f'{pid:<15} {r["risk_score"]:<10} {r["uptime_pct"]:<10} {r["status"]}')

with open('/content/scaler.pkl',    'wb') as f: pickle.dump(scaler, f)
with open('/content/node2idx.json', 'w')  as f: json.dump(node2idx, f)

print('Saved:')
print('  logs/model.pt       ← trained GRU weights')
print('  logs/scaler.pkl     ← MinMaxScaler')
print('  logs/node2idx.json  ← peer ID mapping')
print('  logs/loss_curve.png ← training curve')

from google.colab import files
files.download('/content/model.pt')
files.download('/content/scaler.pkl')
files.download('/content/node2idx.json')
files.download('/content/loss_curve.png')

import numpy as np
import torch

model.eval()

seq = CONFIG['sequence_length']

test_nodes = [
    {
        'name':     'node_always_offline',
        'node_idx': 2,
        'ticks':    [[3, 7000, 5, 2]] * 1000,
        'expected': 'HIGH RISK > 0.7'
    },
    {
        'name':     'node_always_offline',
        'node_idx': 1,
        'ticks':    [[3, 7000, 5, 2]] * 1000,
        'expected': 'HIGH RISK > 0.7'
    },
    {
        'name':     'node_always_offline',
        'node_idx': 3,
        'ticks':    [[3, 7000, 5, 2]] * 1000,
        'expected': 'HIGH RISK > 0.7'
    }

]


print(f"{'Node':<25} {'Score':<10} {'Expected':<25} {'Pass?'}")
print("-" * 70)
for t in test_nodes:
    feats = np.array(t['ticks'], dtype=np.float32)
    feats = scaler.transform(feats)
    X  = torch.tensor(feats, dtype=torch.float32).unsqueeze(0).to(device)
    ni = torch.tensor([t['node_idx']], dtype=torch.long).to(device)

    with torch.no_grad():
        score = torch.sigmoid(model(X, ni)).item()

    expected = t['expected']
    if   '> 0.7'    in expected: passed = score > 0.7
    elif '> 0.6'    in expected: passed = score > 0.6
    elif '> 0.5'    in expected: passed = score > 0.5
    elif '< 0.2'    in expected: passed = score < 0.2
    elif '< 0.4'    in expected: passed = score < 0.4
    elif '< 0.5'    in expected: passed = score < 0.5
    elif '0.3 - 0.6' in expected: passed = 0.3 <= score <= 0.6
    else:                          passed = True

    status = "PASS" if passed else "FAIL"
    print(f"{t['name']:<25} {score:<10.3f} {expected:<25} {status}")

import numpy as np
print("Scaler feature ranges (min, max from training data):")
for i, name in enumerate(['missedCount', 'latencyMs', 'day', 'hour']):
    print(f"  {name:<15} min={scaler.data_min_[i]:.1f}  max={scaler.data_max_[i]:.1f}")

print()

bad_tick  = np.array([[3, 7000, 5, 2]], dtype=np.float32)
good_tick = np.array([[0, 150,  1, 14]], dtype=np.float32)
night_tick = np.array([[0, 200, 0, 23]], dtype=np.float32)

print("bad tick  after scaler:", scaler.transform(bad_tick))
print("good tick after scaler:", scaler.transform(good_tick))
print("night tick after scaler:", scaler.transform(night_tick))

print()

model.eval()
from collections import defaultdict

node_val_recs = defaultdict(list)
for r in val_records:
    node_val_recs[r['peerId']].append(r)

print("Scores using REAL val data:")
print(f"{'Node':<15} {'Avg score':<12} {'Actual offline%'}")
print('-' * 42)
for pid, recs in node_val_recs.items():
    if len(recs) < CONFIG['sequence_length']:
        continue
    scores = []
    feats  = np.array([[r['missedCount'], r['latencyMs'], r['day'], r['hour']]
                        for r in recs], dtype=np.float32)
    feats  = scaler.transform(feats)
    seq    = CONFIG['sequence_length']
    for i in range(0, len(feats) - seq, seq):
        X  = torch.tensor(feats[i:i+seq], dtype=torch.float32).unsqueeze(0).to(device)
        ni = torch.tensor([node2idx[pid]], dtype=torch.long).to(device)
        with torch.no_grad():
            scores.append(torch.sigmoid(model(X, ni)).item())
    actual_offline = sum(r['label'] for r in recs) / len(recs) * 100
    print(f"{pid:<15} {np.mean(scores):<12.3f} {actual_offline:.1f}%")