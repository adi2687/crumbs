# Build the shard flow matrix, check sums, normalize to target row totals, and show key summaries
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from caas_jupyter_tools import display_dataframe_to_user

# Raw entries (shards) as described by the user
# Rows: source; Columns: destination
data = pd.DataFrame({
    "A": {"A": 0.0,     "B": 3.125,  "C": 5.625,  "D": 6.25},
    "B": {"A": 3.41,    "B": 0.0,    "C": 10.2,   "D": 11.36},
    "C": {"A": 7.5,     "B": 12.5,   "C": 0.0,    "D": 25.0},
    "D": {"A": 4.1,     "B": 9.375,  "C": 29.17,  "D": 7.39},
}).T  # Note: .T so index=source rows; columns=dest

data.index.name = "Source"
data.columns.name = "Destination"

# Target row totals (as stated)
target_row_totals = pd.Series({
    "A": 15.0,
    "B": 25.0,
    "C": 45.0,
    "D": 50.0
}, name="Target Outgoing")

# Actual row totals
row_totals = data.sum(axis=1).rename("Actual Outgoing")

# Differences vs target
row_diff = (row_totals - target_row_totals).rename("Outgoing Diff (Actual-Target)")

# Incoming totals (column sums)
col_totals = data.sum(axis=0).rename("Incoming Total")

# Global totals
global_actual = row_totals.sum()
global_target = target_row_totals.sum()
global_diff = global_actual - global_target

# Normalized matrix per-row to hit exact target totals (proportional scaling)
scale = (target_row_totals / row_totals).replace([np.inf, -np.inf], 0).fillna(0)
norm = data.mul(scale, axis=0)

# Sanity recompute on normalized
norm_row_totals = norm.sum(axis=1).rename("Normalized Outgoing (Should equal Target)")
norm_col_totals = norm.sum(axis=0).rename("Normalized Incoming")

# Percent routing per source (normalized)
percent = norm.div(norm.sum(axis=1), axis=0).replace([np.inf, -np.inf], 0).fillna(0) * 100
percent = percent.round(3)

# Net flow per node (Incoming - Outgoing), actual and normalized
net_actual = (col_totals - row_totals).rename("Net Flow (Actual In - Out)")
net_norm = (norm_col_totals - target_row_totals).rename("Net Flow (Normalized In - Out)")

# Round some displays for neatness
summary = pd.concat([row_totals.round(3), target_row_totals, row_diff.round(3)], axis=1)
incoming = col_totals.round(3).to_frame()
nets = pd.concat([net_actual.round(3), net_norm.round(3)], axis=1)

# Save CSVs for download
data.to_csv("/mnt/data/shard_matrix_raw.csv")
norm.to_csv("/mnt/data/shard_matrix_normalized.csv")
percent.to_csv("/mnt/data/shard_routing_percentages.csv")
summary.to_csv("/mnt/data/shard_row_sums_vs_target.csv")
incoming.to_csv("/mnt/data/shard_incoming_totals.csv")
nets.to_csv("/mnt/data/shard_net_flows.csv")

# Display key tables to the user
display_dataframe_to_user("Shard Flow Matrix (Raw)", data.round(3).reset_index())
display_dataframe_to_user("Row Totals vs Target", summary.reset_index())
display_dataframe_to_user("Incoming Totals (Actual)", incoming.reset_index())
display_dataframe_to_user("Normalized Routing Percentages (%)", percent.reset_index())
display_dataframe_to_user("Net Flows (Actual vs Normalized)", nets.reset_index())

# Plot: Actual vs Target outgoing per node
plt.figure()
x = np.arange(len(row_totals.index))
width = 0.35
plt.bar(x - width/2, row_totals.values)
plt.bar(x + width/2, target_row_totals.values)
plt.xticks(x, row_totals.index)
plt.title("Outgoing Shards: Actual vs Target")
plt.xlabel("Node")
plt.ylabel("Shards")
plt.legend(["Actual", "Target"])
plt.tight_layout()
plt.savefig("/mnt/data/outgoing_actual_vs_target.png")
plt.close()

# Plot: Incoming vs Outgoing (Normalized)
plt.figure()
x = np.arange(len(norm_row_totals.index))
plt.bar(x - width/2, norm_col_totals.values)
plt.bar(x + width/2, target_row_totals.values)
plt.xticks(x, norm_row_totals.index)
plt.title("Incoming (Normalized) vs Outgoing Targets")
plt.xlabel("Node")
plt.ylabel("Shards")
plt.legend(["Incoming (Normalized)", "Outgoing (Target)"])
plt.tight_layout()
plt.savefig("/mnt/data/incoming_vs_outgoing_normalized.png")
plt.close()

# Prepare a brief printed summary
print("Global totals (actual vs target):", round(global_actual, 3), "vs", round(global_target, 3), 
      "| Diff:", round(global_diff, 3))
print("\nRow diffs (Actual - Target):")
print(row_diff.round(3))
print("\nNotes: Positive net flow means node receives more than it sends.")


