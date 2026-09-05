"""Recurrent Memory Engine.

A fixed-size state vector is updated token-by-token.  The mechanism
uses *additive superposition*: every token is converted to a
deterministic signature and *added* to a memory slot chosen by
``token % K``.  Because different tokens can map to the same slot,
their signatures accumulate and interfere.

**Query** works by comparing the target token's expected signature
against the actual (superposed) slot value.  When many tokens have
been added to the same slot the target's contribution is diluted and
recall degrades — this is the core educational demonstration.

The entire mechanism is:
  * deterministic (same seed → same result)
  * inspectable  (every step is traced)
  * bounded      (state size == memory_slots, always)
"""

from __future__ import annotations

import math
from typing import Any, Optional

import numpy as np


# ---------------------------------------------------------------------------
# Deterministic token → signature mapping
# ---------------------------------------------------------------------------

# We use a prime-based irrational scaling so that distinct tokens produce
# signatures that are unlikely to cancel by accident.  This is intentionally
# simple and explainable.

_PHI = (1 + math.sqrt(5)) / 2  # golden ratio ≈ 1.618


def token_signature(token: int) -> float:
    """Return a deterministic, nonzero, token-specific scalar.

    Properties:
      * Distinct tokens → distinct signatures (within float precision).
      * All signatures are positive and bounded for the allowed vocab range.
      * The formula is fully transparent and has no learned parameters.
    """
    return 1.0 + 0.3 * math.sin(token * _PHI) + 0.2 * math.cos(token * math.sqrt(2))


# ---------------------------------------------------------------------------
# Engine
# ---------------------------------------------------------------------------

class RecurrentMemoryEngine:
    """Fixed-size recurrent memory with additive-superposition updates.

    Parameters
    ----------
    memory_slots : int
        Number of scalar slots in the state vector (*K*).
    vocabulary_size : int
        Upper bound on token values (used only for documentation/validation).
    interference : float
        Amount of Gaussian noise added to each update (0 = none, 1 = heavy).
    seed : int
        Seed for the noise RNG (deterministic given the same seed).
    """

    def __init__(
        self,
        memory_slots: int,
        vocabulary_size: int = 100,
        interference: float = 0.0,
        seed: int = 42,
    ) -> None:
        self.memory_slots = memory_slots
        self.vocabulary_size = vocabulary_size
        self.interference = interference
        self._rng = np.random.default_rng(seed)

        # --- mutable state ---
        self.state: np.ndarray = np.zeros(memory_slots, dtype=np.float64)
        self.slot_write_counts: np.ndarray = np.zeros(memory_slots, dtype=np.int64)
        self.trace: list[dict[str, Any]] = []
        self.total_collisions: int = 0

    # ------------------------------------------------------------------
    # public API
    # ------------------------------------------------------------------

    def reset(self) -> None:
        """Clear state, counts, and trace — ready for a new sequence."""
        self.state[:] = 0.0
        self.slot_write_counts[:] = 0
        self.trace.clear()
        self.total_collisions = 0

    def step(self, token: int, position: int) -> dict[str, Any]:
        """Process one token and update the state.

        Returns the trace item for this step.
        """
        slot = token % self.memory_slots
        sig = token_signature(token)

        slot_before = float(self.state[slot])

        # Collision = slot already written to by a *different* step
        collision = bool(self.slot_write_counts[slot] > 0)
        if collision:
            self.total_collisions += 1

        # ----- core update: additive superposition -----
        self.state[slot] += sig

        # Optional interference noise (seeded → deterministic)
        if self.interference > 0:
            noise = self._rng.normal(0.0, self.interference)
            self.state[slot] += noise

        self.slot_write_counts[slot] += 1

        slot_after = float(self.state[slot])

        item: dict[str, Any] = {
            "position": position,
            "token": token,
            "updated_slot": slot,
            "slot_before": round(slot_before, 8),
            "slot_after": round(slot_after, 8),
            "state": [round(v, 8) for v in self.state.tolist()],
            "state_norm": round(float(np.linalg.norm(self.state)), 8),
            "collision": collision,
            "collision_count": int(self.slot_write_counts[slot]),
            "active_slots": int(np.count_nonzero(self.state)),
        }
        self.trace.append(item)
        return item

    def process(self, sequence: list[int]) -> None:
        """Sequentially process every token in *sequence*."""
        for pos, token in enumerate(sequence):
            self.step(token, pos)

    def query(self, target_token: int, query_position: int | None = None) -> dict[str, Any]:
        """Query whether *target_token*'s information is recoverable.

        If *query_position* is given, query the state snapshot saved in
        the trace at that position; otherwise query the current (final)
        state.

        Returns a prediction dict with confidence and recovered flag.
        """
        if query_position is not None and 0 <= query_position < len(self.trace):
            state_snapshot = np.array(self.trace[query_position]["state"], dtype=np.float64)
            # Reconstruct write counts up to that position
            wc = np.zeros(self.memory_slots, dtype=np.int64)
            for t in self.trace[: query_position + 1]:
                wc[t["updated_slot"]] += 1
            active_query_position = query_position
        else:
            state_snapshot = self.state
            wc = self.slot_write_counts
            active_query_position = len(self.trace) - 1 if self.trace else 0

        slot = target_token % self.memory_slots
        expected_sig = token_signature(target_token)
        actual_value = float(state_snapshot[slot])
        writes_to_slot = int(wc[slot])

        # Confidence based on residual dominance in the queried slot.
        # If actual slot is close to target signature, confidence is high.
        if writes_to_slot == 0:
            confidence = 0.0
        else:
            residual = abs(actual_value - expected_sig)
            norm = max(abs(actual_value), abs(expected_sig), 1e-9)
            confidence = max(0.0, 1.0 - (residual / norm))

        predicted_token = self._decode_token_from_slot(slot, actual_value, writes_to_slot)
        recovered = confidence >= 0.5 and predicted_token == target_token
        if writes_to_slot == 0:
            recall_status = "inconclusive"
        elif recovered:
            recall_status = "success"
        elif confidence >= 0.25:
            recall_status = "degraded"
        else:
            recall_status = "failure"

        return {
            "query_position": active_query_position,
            "target_token": target_token,
            "target_slot": slot,
            "expected_signature": round(expected_sig, 8),
            "actual_slot_value": round(actual_value, 8),
            "slot_write_count": writes_to_slot,
            "confidence": round(confidence, 6),
            "predicted_token": predicted_token,
            "recall_status": recall_status,
            "recovered": recovered,
        }

    def _decode_token_from_slot(self, slot: int, slot_value: float, write_count: int) -> Optional[int]:
        """Decode a token estimate from slot value and write count.

        This does not read the original sequence. It only uses:
          - current slot value
          - number of writes to that slot
          - known vocabulary signatures constrained to the same slot
        """
        if write_count <= 0:
            return None

        candidates = [
            token
            for token in range(self.vocabulary_size)
            if token % self.memory_slots == slot
        ]
        if not candidates:
            return None

        estimated_mean = slot_value / write_count
        predicted = min(
            candidates,
            key=lambda token: abs(token_signature(token) - estimated_mean),
        )
        return int(predicted)

    def get_state(self) -> list[float]:
        """Return the current state vector as a plain list."""
        return [round(v, 8) for v in self.state.tolist()]

    def get_trace(self) -> list[dict[str, Any]]:
        """Return the full processing trace."""
        return list(self.trace)
