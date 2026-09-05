"""Experiment runner.

Orchestrates: parameter validation → sequence generation →
engine processing → query → metrics → explanation.
"""

from __future__ import annotations

import uuid
from typing import Any

from ..config import settings
from .memory import RecurrentMemoryEngine
from .metrics import compute_metrics
from .reproducibility import generate_sequence, make_rng


# ---------------------------------------------------------------------------
# In-memory experiment registry (no database)
# ---------------------------------------------------------------------------

_EXPERIMENT_STORE: dict[str, dict[str, Any]] = {}


def get_experiment(experiment_id: str) -> dict[str, Any] | None:
    """Retrieve a stored experiment result by ID."""
    return _EXPERIMENT_STORE.get(experiment_id)


def clear_experiments() -> None:
    """Clear stored experiments (useful for tests)."""
    _EXPERIMENT_STORE.clear()


# ---------------------------------------------------------------------------
# Explanation builder
# ---------------------------------------------------------------------------

def _build_explanation(
    metrics: dict[str, Any],
    prediction: dict[str, Any],
    *,
    target_seen_before_query: bool,
) -> dict[str, Any]:
    """Generate an explanation object based on actual experiment results."""
    collision_rate = metrics["collision_rate"]
    capacity_pressure = metrics["capacity_pressure"]
    recovered = prediction["recovered"]
    confidence = prediction["confidence"]
    writes = prediction["slot_write_count"]
    recall_status = prediction["recall_status"]

    # Mechanism — always the same (describes the toy model)
    mechanism = (
        "Each token is mapped to a fixed memory slot via modular arithmetic "
        "(token % K) and its deterministic signature is added to the slot. "
        "When multiple tokens map to the same slot their signatures "
        "superpose, diluting any single token's contribution."
    )

    # Observation — based on what actually happened
    if recovered:
        if writes == 1:
            observation = (
                f"The target token's slot received only 1 write, so its "
                f"signature was preserved without interference "
                f"(confidence={confidence:.3f})."
            )
        else:
            observation = (
                f"Despite {writes} writes to the target's slot, the "
                f"target's signature remained dominant "
                f"(confidence={confidence:.3f})."
            )
    else:
        observation = (
            f"The target's slot received {writes} writes.  The accumulated "
            f"superposition diluted the target's signature below the "
            f"recovery threshold (confidence={confidence:.3f})."
        )

    # Limitation
    if collision_rate > 0.5:
        limitation = (
            "High collision rate ({:.1%}) means most tokens shared slots.  "
            "In this regime the fixed-size state cannot faithfully represent "
            "every token — analogous to capacity limits in recurrent memory "
            "systems.".format(collision_rate)
        )
    elif capacity_pressure > 5:
        limitation = (
            f"Capacity pressure is {capacity_pressure:.1f}× (sequence_length / "
            f"memory_slots).  At this ratio, slot collisions are likely and "
            f"recall of any specific token becomes unreliable."
        )
    else:
        limitation = (
            "Under the current parameters the memory capacity is sufficient.  "
            "Increasing sequence length or decreasing memory slots would "
            "increase capacity pressure and may degrade recall."
        )

    if not target_seen_before_query:
        outcome = "inconclusive"
        evidence = (
            f"Query position {prediction['query_position']} occurs before target introduction, "
            "so this run cannot evaluate recall of the target token."
        )
    elif recall_status == "success":
        outcome = "recall_success"
        evidence = (
            f"At query position {prediction['query_position']}, target recall succeeded "
            f"with confidence={confidence:.3f}, slot_write_count={writes}, "
            f"collision_rate={collision_rate:.3f}."
        )
    else:
        outcome = "recall_degraded"
        evidence = (
            f"At query position {prediction['query_position']}, target signal was degraded "
            f"(confidence={confidence:.3f}) under slot contention "
            f"(slot_write_count={writes}, collision_rate={collision_rate:.3f})."
        )

    return {
        "mechanism": mechanism,
        "observation": observation,
        "limitation": limitation,
        "claim_test_result": {
            "outcome": outcome,
            "evidence": evidence,
            "scope": "this experiment",
        },
    }


# ---------------------------------------------------------------------------
# Single experiment
# ---------------------------------------------------------------------------

def run_experiment(
    *,
    sequence_length: int,
    memory_slots: int,
    vocabulary_size: int,
    target_token: int,
    interference: float = 0.0,
    seed: int = 42,
    target_position: int | None = None,
    query_position: int | None = None,
) -> dict[str, Any]:
    """Run a single experiment and return the full result dict.

    The result is also stored in the in-memory registry.
    """
    # ---- deterministic RNG ----
    rng = make_rng(seed)

    # ---- generate sequence ----
    sequence, actual_target_pos = generate_sequence(
        rng,
        length=sequence_length,
        vocabulary_size=vocabulary_size,
        target_token=target_token,
        target_position=target_position,
    )

    # ---- run engine ----
    engine = RecurrentMemoryEngine(
        memory_slots=memory_slots,
        vocabulary_size=vocabulary_size,
        interference=interference,
        seed=seed,
    )
    engine.process(sequence)

    # ---- query ----
    effective_query_position = sequence_length - 1 if query_position is None else query_position
    prediction = engine.query(target_token, query_position=effective_query_position)
    target_seen_before_query = actual_target_pos <= effective_query_position
    if not target_seen_before_query:
        prediction["recovered"] = False
        prediction["recall_status"] = "inconclusive"
        prediction["confidence"] = 0.0

    trace = engine.get_trace()
    for i, item in enumerate(trace):
        p = engine.query(target_token, query_position=i)
        item["target_signal"] = p["confidence"]
        item["target_present"] = i >= actual_target_pos

    # ---- metrics ----
    metrics = compute_metrics(
        sequence_length=sequence_length,
        memory_slots=memory_slots,
        final_state=engine.get_state(),
        total_collisions=engine.total_collisions,
        slot_write_counts=engine.slot_write_counts.tolist(),
        prediction=prediction,
    )

    # ---- explanation ----
    explanation = _build_explanation(
        metrics,
        prediction,
        target_seen_before_query=target_seen_before_query,
    )

    # ---- assemble result ----
    experiment_id = str(uuid.uuid4())

    target_occurrences = sequence.count(target_token)
    if target_occurrences != 1:
        raise RuntimeError(
            f"Sequence generation invariant violated: target appears {target_occurrences} times."
        )

    result: dict[str, Any] = {
        "experiment_id": experiment_id,
        "seed": seed,
        "parameters": {
            "sequence_length": sequence_length,
            "memory_slots": memory_slots,
            "vocabulary_size": vocabulary_size,
            "target_token": target_token,
            "interference": interference,
            "target_position": target_position,
            "query_position": query_position,
        },
        "sequence": sequence,
        "target_token": target_token,
        "ground_truth": {
            "target_token": target_token,
            "target_position": actual_target_pos,
            "present_in_sequence": True,
            "target_occurrences": target_occurrences,
            "query_position": effective_query_position,
            "target_seen_before_query": target_seen_before_query,
        },
        "prediction": prediction,
        "correct": prediction["recovered"],
        "metrics": metrics,
        "memory_trace": trace,
        "final_state": engine.get_state(),
        "explanation": explanation,
    }

    # Store for later retrieval
    _EXPERIMENT_STORE[experiment_id] = result
    return result


# ---------------------------------------------------------------------------
# Sweep
# ---------------------------------------------------------------------------

def run_sweep(
    *,
    sweep_parameter: str,
    sweep_values: list[int | float],
    base_sequence_length: int = 32,
    base_memory_slots: int = 8,
    base_vocabulary_size: int = 20,
    base_target_token: int = 7,
    base_interference: float = 0.0,
    seed: int = 42,
) -> list[dict[str, Any]]:
    """Run experiments across a sweep of one parameter.

    The seed for each run is ``seed + index`` so results are
    deterministic and independent.
    """
    valid_params = {"sequence_length", "memory_slots", "interference"}
    if sweep_parameter not in valid_params:
        raise ValueError(
            f"Invalid sweep parameter '{sweep_parameter}'. "
            f"Must be one of {sorted(valid_params)}."
        )

    results: list[dict[str, Any]] = []

    if base_target_token >= base_vocabulary_size:
        raise ValueError(
            f"base_target_token ({base_target_token}) must be < base_vocabulary_size ({base_vocabulary_size})."
        )

    for value in sweep_values:
        kwargs: dict[str, Any] = {
            "sequence_length": base_sequence_length,
            "memory_slots": base_memory_slots,
            "vocabulary_size": base_vocabulary_size,
            "target_token": base_target_token,
            "interference": base_interference,
            "seed": seed,
        }

        if sweep_parameter in {"sequence_length", "memory_slots"}:
            if not float(value).is_integer():
                raise ValueError(
                    f"Sweep value '{value}' is invalid for '{sweep_parameter}': integer required."
                )
            coerced_value: int | float = int(value)
        else:
            coerced_value = float(value)

        if sweep_parameter == "sequence_length" and not (
            settings.MIN_SEQUENCE_LENGTH <= coerced_value <= settings.MAX_SEQUENCE_LENGTH
        ):
            raise ValueError(
                f"Sweep value '{coerced_value}' out of range for sequence_length "
                f"[{settings.MIN_SEQUENCE_LENGTH}, {settings.MAX_SEQUENCE_LENGTH}]."
            )
        if sweep_parameter == "memory_slots" and not (
            settings.MIN_MEMORY_SLOTS <= coerced_value <= settings.MAX_MEMORY_SLOTS
        ):
            raise ValueError(
                f"Sweep value '{coerced_value}' out of range for memory_slots "
                f"[{settings.MIN_MEMORY_SLOTS}, {settings.MAX_MEMORY_SLOTS}]."
            )
        if sweep_parameter == "interference" and not (0.0 <= coerced_value <= 1.0):
            raise ValueError("Sweep value out of range for interference [0.0, 1.0].")

        kwargs[sweep_parameter] = coerced_value

        exp = run_experiment(**kwargs)
        results.append({
            "parameter": coerced_value,
            "experiment_id": exp["experiment_id"],
            "correct": exp["correct"],
            "accuracy": exp["metrics"]["accuracy"],
            "collision_rate": exp["metrics"]["collision_rate"],
            "memory_utilization": exp["metrics"]["memory_utilization"],
            "target_signal": exp["metrics"]["target_signal"],
            "capacity_pressure": exp["metrics"]["capacity_pressure"],
        })

    return results
