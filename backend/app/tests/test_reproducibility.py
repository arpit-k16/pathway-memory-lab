"""Tests proving deterministic reproducibility.

Same parameters + seed → identical sequence, trace, state, metrics.
"""

from app.core.experiment import run_experiment


def test_identical_seed_produces_identical_results():
    """Two runs with the same params+seed must be byte-identical."""
    kwargs = dict(
        sequence_length=32,
        memory_slots=8,
        vocabulary_size=20,
        target_token=7,
        interference=0.1,
        seed=42,
    )
    r1 = run_experiment(**kwargs)
    r2 = run_experiment(**kwargs)

    assert r1["sequence"] == r2["sequence"]
    assert r1["final_state"] == r2["final_state"]
    assert r1["memory_trace"] == r2["memory_trace"]
    assert r1["metrics"]["collision_rate"] == r2["metrics"]["collision_rate"]
    assert r1["correct"] == r2["correct"]


def test_different_seed_may_differ():
    """Different seeds should generally produce different sequences."""
    r1 = run_experiment(
        sequence_length=32, memory_slots=8, vocabulary_size=20,
        target_token=7, seed=1,
    )
    r2 = run_experiment(
        sequence_length=32, memory_slots=8, vocabulary_size=20,
        target_token=7, seed=999,
    )
    # Sequences should differ (astronomically unlikely to match)
    assert r1["sequence"] != r2["sequence"]
    assert r1["ground_truth"]["target_position"] != r2["ground_truth"]["target_position"] or r1["sequence"] != r2["sequence"]


def test_deterministic_trace():
    """The full trace must be identical across repeated runs."""
    kwargs = dict(
        sequence_length=16,
        memory_slots=4,
        vocabulary_size=10,
        target_token=5,
        interference=0.3,
        seed=77,
    )
    t1 = run_experiment(**kwargs)["memory_trace"]
    t2 = run_experiment(**kwargs)["memory_trace"]
    for a, b in zip(t1, t2):
        assert a == b


def test_deterministic_metrics():
    """Metrics must be identical for identical params+seed."""
    kwargs = dict(
        sequence_length=64,
        memory_slots=8,
        vocabulary_size=30,
        target_token=10,
        interference=0.5,
        seed=123,
    )
    m1 = run_experiment(**kwargs)["metrics"]
    m2 = run_experiment(**kwargs)["metrics"]
    assert m1 == m2


def test_target_occurs_exactly_once():
    result = run_experiment(
        sequence_length=64,
        memory_slots=8,
        vocabulary_size=20,
        target_token=7,
        seed=42,
    )
    assert result["ground_truth"]["target_occurrences"] == 1
    assert result["sequence"].count(7) == 1


def test_query_position_changes_outcome_window():
    kwargs = dict(
        sequence_length=20,
        memory_slots=4,
        vocabulary_size=20,
        target_token=7,
        target_position=15,
        seed=13,
    )
    before = run_experiment(**kwargs, query_position=10)
    after = run_experiment(**kwargs, query_position=19)
    assert before["ground_truth"]["target_seen_before_query"] is False
    assert before["prediction"]["recall_status"] == "inconclusive"
    assert after["ground_truth"]["target_seen_before_query"] is True


def test_metrics_include_collision_and_utilization():
    result = run_experiment(
        sequence_length=40,
        memory_slots=4,
        vocabulary_size=30,
        target_token=7,
        seed=5,
    )
    metrics = result["metrics"]
    assert metrics["collision_count"] >= 0
    assert 0.0 <= metrics["memory_utilization"] <= 1.0
