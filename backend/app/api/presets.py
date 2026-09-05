"""Educational preset definitions.

Each preset defines:
  * parameters — a ready-to-use experiment configuration
  * purpose    — why this preset exists pedagogically
  * expected_phenomenon — what the learner should *investigate*

IMPORTANT: No preset guarantees a particular outcome.  The backend
always reports the actual observed result.
"""

from __future__ import annotations

from typing import Any, Dict

from ..schemas import PresetInfo

# Raw preset data — parameters are dicts that map directly to
# run_experiment() kwargs.

PRESETS: Dict[str, Dict[str, Any]] = {
    "baseline": {
        "parameters": {
            "sequence_length": 16,
            "memory_slots": 16,
            "vocabulary_size": 20,
            "target_token": 7,
            "interference": 0.0,
            "seed": 42,
        },
        "purpose": (
            "A gentle starting point where memory capacity equals sequence "
            "length.  Designed to let the learner observe how the engine "
            "works before adding pressure."
        ),
        "expected_phenomenon": (
            "With one slot per token, collisions depend entirely on the "
            "random sequence.  Investigate whether the target is recovered "
            "and how many collisions occur."
        ),
    },
    "long_sequence": {
        "parameters": {
            "sequence_length": 128,
            "memory_slots": 16,
            "vocabulary_size": 20,
            "target_token": 7,
            "interference": 0.0,
            "seed": 42,
        },
        "purpose": (
            "Increase sequence length well beyond memory capacity to "
            "observe how capacity pressure affects recall."
        ),
        "expected_phenomenon": (
            "With 128 tokens and only 16 slots, each slot receives ~8 "
            "writes on average.  Investigate whether the target's signal "
            "is diluted by superposition."
        ),
    },
    "low_capacity": {
        "parameters": {
            "sequence_length": 32,
            "memory_slots": 4,
            "vocabulary_size": 20,
            "target_token": 7,
            "interference": 0.0,
            "seed": 42,
        },
        "purpose": (
            "Reduce memory capacity to just 4 slots while keeping a "
            "moderate sequence length, creating extreme slot contention."
        ),
        "expected_phenomenon": (
            "With only 4 slots, every slot receives many writes.  "
            "Investigate collision rate and whether the target's "
            "contribution can still be distinguished."
        ),
    },
    "high_interference": {
        "parameters": {
            "sequence_length": 32,
            "memory_slots": 8,
            "vocabulary_size": 20,
            "target_token": 7,
            "interference": 0.8,
            "seed": 42,
        },
        "purpose": (
            "Add heavy noise to state updates while keeping moderate "
            "capacity pressure.  Separates the effect of noise from "
            "the effect of collisions."
        ),
        "expected_phenomenon": (
            "Noise perturbs slot values, potentially distorting the "
            "target's signature.  Investigate whether noise alone can "
            "cause recall failure even when capacity is adequate."
        ),
    },
    "break_the_memory": {
        "parameters": {
            "sequence_length": 256,
            "memory_slots": 4,
            "vocabulary_size": 50,
            "target_token": 7,
            "interference": 0.5,
            "seed": 42,
        },
        "purpose": (
            "Combine extreme capacity pressure with moderate noise.  "
            "This creates conditions where recall is very challenging."
        ),
        "expected_phenomenon": (
            "With 256 tokens, 4 slots, and noise, each slot receives "
            "~64 writes plus noise.  Investigate whether any single "
            "token's information can survive this level of interference."
        ),
    },
}


def get_all_presets() -> list[PresetInfo]:
    """Return PresetInfo objects for all presets."""
    from ..schemas import ExperimentRequest

    result = []
    for name, data in PRESETS.items():
        result.append(
            PresetInfo(
                name=name,
                parameters=ExperimentRequest(**data["parameters"]),
                purpose=data["purpose"],
                expected_phenomenon=data["expected_phenomenon"],
            )
        )
    return result


# ---------------------------------------------------------------------------
# Router
# ---------------------------------------------------------------------------
from fastapi import APIRouter

router = APIRouter(tags=["presets"])


@router.get("/presets", response_model=list[PresetInfo])
def list_presets() -> list[PresetInfo]:
    """Return all available presets with their educational metadata."""
    return get_all_presets()
