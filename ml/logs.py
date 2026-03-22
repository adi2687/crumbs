import json
import random
from datetime import datetime, timedelta

peers = {
  "peer-A3F2": {"type": "student"},
  "peer-B71C": {"type": "flaky"},
  "peer-D09E": {"type": "office"},
  "peer-F44A": {"type": "always_on"},
}

def is_offline(peer_type, hour, day):
    if peer_type == 'student':
        # online: weekdays 8am-11pm
        if day >= 5: return True                    # weekend — offline
        if hour < 8 or hour >= 23: return True      # night — offline
        return random.random() < 0.03               # rarely drops during day

    if peer_type == 'flaky':
        return random.random() < 0.15               # random drops anytime

    if peer_type == 'office':
        if day >= 5: return True                    # weekend — offline
        if hour < 9 or hour >= 18: return True      # off hours — offline
        return random.random() < 0.02               # rarely drops at work

    if peer_type == 'always_on':
        return random.random() < 0.005

logs = []
start = datetime.now() - timedelta(days=14)
node2idx = {p: i for i, p in enumerate(peers)}

for day_offset in range(14):
  for minute in range(0, 1440, 1):
    ts = start + timedelta(days=day_offset, minutes=minute)
    hour, day = ts.hour, ts.weekday()
    for peerId, meta in peers.items():
      offline = is_offline(meta["type"], hour, day)
      missed = random.randint(1,3) if offline else 0
      latency = random.randint(2000,8000) if offline else random.randint(100,500)
      logs.append({
        "peerId": peerId,
        "node_idx": node2idx[peerId],
        "missedCount": missed,
        "latencyMs": latency,
        "day": day,
        "hour": hour,
        "label": 1 if offline else 0
      })


with open("heartbeats1.json", "w") as f:

    f.write("[")
    for l in logs: f.write(json.dumps(l) + ",\n")
    f.write("]")
print(f"Generated {len(logs)} records")