# Cell 2 — replace entire fake data generator with this

import json, random, os
from datetime import datetime, timedelta

os.makedirs('logs', exist_ok=True)

peers = {
    'peer-A3F2': 'student',
    'peer-B71C': 'flaky',
    'peer-D09E': 'office',
    'peer-F44A': 'always_on',
}

def get_signal(peer_type, hour, day):
    """
    Returns (missed, latency, label)
    Each node has a CLEAN deterministic pattern
    so the model has no excuse not to learn it
    """

    # student — offline nights + weekends
    if peer_type == 'student':
        if day >= 5 or hour < 8 or hour >= 23:
            return 3, 7000, 1          # clearly offline
        return 0, random.randint(100, 300), 0   # clearly online

    # flaky — randomly drops, but when it drops it's obvious
    if peer_type == 'flaky':
        if random.random() < 0.15:
            return 3, 7000, 1          # clearly offline
        return 0, random.randint(100, 300), 0

    # office worker — ONLY online weekdays 9am-6pm
    if peer_type == 'office':
        if day >= 5 or hour < 9 or hour >= 18:
            return 3, 7000, 1          # clearly offline
        return 0, random.randint(100, 300), 0

    # always on — almost never offline
    if peer_type == 'always_on':
        if random.random() < 0.005:
            return 3, 7000, 1
        return 0, random.randint(100, 300), 0

logs = []
start    = datetime.now() - timedelta(days=14)
node2idx = {p: i for i, p in enumerate(peers)}

for day_offset in range(14):
    for minute in range(0, 1440, 1):
        ts   = start + timedelta(days=day_offset, minutes=minute)
        hour = ts.hour
        day  = ts.weekday()
        for peerId, ptype in peers.items():
            missed, latency, label = get_signal(ptype, hour, day)
            logs.append({
                'peerId':      peerId,
                'node_idx':    node2idx[peerId],
                'missedCount': missed,
                'latencyMs':   latency,
                'day':         day,
                'hour':        hour,
                'label':       label
            })

with open('logs/heartbeats.jsonl', 'w') as f:
    f.write("[")
    for l in logs:
        f.write(json.dumps(l) + ',\n')
    f.write("]")

# verify the patterns look right
from collections import defaultdict
node_recs = defaultdict(list)
for l in logs:
    node_recs[l['peerId']].append(l)

print(f"{'Node':<15} {'Total':<10} {'Offline%':<12} {'Avg missed':<14} {'Expected offline%'}")
print("-" * 65)
expected = {'peer-A3F2': '~40%', 'peer-B71C': '~15%', 'peer-D09E': '~60%', 'peer-F44A': '~0.5%'}
for pid, recs in node_recs.items():
    total   = len(recs)
    offline = sum(r['label'] for r in recs)
    avg_m   = sum(r['missedCount'] for r in recs) / total
    print(f"{pid:<15} {total:<10} {offline/total*100:<12.1f} {avg_m:<14.2f} {expected[pid]}")
