"""Metric calculations for a completed experiment.

Every function is a pure function — no side-effects, no hidden state.
Definitions are intentionally simple and transparent.
"""

from __future__ import annotations

from typing import Any

import numpy as np


def compute_metrics(
    *,
    sequence_length: int,
    memory_slots: int,
    final_state: list[float],
    total_collisions: int,
    slot_write_counts: list[int],
    prediction: dict[str, Any],
) -> dict[str, Any]:
    """Compute all experiment metrics from raw engine outputs.

    Parameters
    ----------
    sequence_length : int
        Length of the processed sequence.
    memory_slots : int
        Number of fixed memory slots (*K*).
    final_state : list[float]
        The engine's final state vector.
    total_collisions : int
        Total number of collision events during processing.
    slot_write_counts : list[int]
        How many tokens were written to each slot.
    prediction : dict
        The query result dict from ``engine.query()``.

    Returns
    -------
    dict with all metric values.
    """
    state_arr = np.array(final_state, dtype=np.float64)
    wc = np.array(slot_write_counts, dtype=np.int64)

    # Number of slots that received at least one write
    active_slots = int(np.count_nonzero(wc))

    # Memory utilization: fraction of slots actually used
    memory_utilization = active_slots / memory_slots if memory_slots > 0 else 0.0

    # Collision rate: collisions / total updates
    collision_rate = total_collisions / sequence_length if sequence_length > 0 else 0.0

    # Euclidean norm of the final state
    state_norm = float(np.linalg.norm(state_arr))

    # Capacity pressure: how much the sequence exceeds memory
    capacity_pressure = sequence_length / memory_slots if memory_slots > 0 else 0.0

    return {
        "correct": prediction["recovered"],
        "accuracy": 1.0 if prediction["recovered"] else 0.0,
        "target_signal": prediction["confidence"],
        "prediction_confidence": prediction["confidence"],
        "memory_utilization": round(memory_utilization, 6),
        "active_slots": active_slots,
        "collision_count": total_collisions,
        "collision_rate": round(collision_rate, 6),
        "state_norm": round(state_norm, 6),
        "capacity_pressure": round(capacity_pressure, 4),
        "slot_write_counts": slot_write_counts,
    }
