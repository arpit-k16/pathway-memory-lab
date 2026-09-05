"""Tests for experiment endpoints."""


def test_single_experiment(client):
    resp = client.post("/api/v1/experiments", json={
        "sequence_length": 32,
        "memory_slots": 8,
        "vocabulary_size": 20,
        "target_token": 7,
        "interference": 0.2,
        "seed": 42,
        "query_position": 20,
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "experiment_id" in data
    assert data["seed"] == 42
    assert len(data["final_state"]) == 8
    assert len(data["sequence"]) == 32
    assert len(data["memory_trace"]) == 32
    assert data["ground_truth"]["query_position"] == 20
    assert data["prediction"]["query_position"] == 20
    assert data["ground_truth"]["target_occurrences"] == 1
    assert "metrics" in data
    assert "explanation" in data
    assert "prediction" in data
    assert "ground_truth" in data


def test_experiment_retrieval(client):
    resp = client.post("/api/v1/experiments", json={
        "sequence_length": 8,
        "memory_slots": 4,
        "vocabulary_size": 10,
        "target_token": 3,
        "seed": 1,
    })
    eid = resp.json()["experiment_id"]
    resp2 = client.get(f"/api/v1/experiments/{eid}")
    assert resp2.status_code == 200
    assert resp2.json()["experiment_id"] == eid


def test_experiment_not_found(client):
    resp = client.get("/api/v1/experiments/nonexistent-id")
    assert resp.status_code == 404


def test_sweep(client):
    resp = client.post("/api/v1/experiments/sweep", json={
        "sweep_parameter": "sequence_length",
        "sweep_values": [8, 16, 32, 64],
        "base_memory_slots": 8,
        "base_vocabulary_size": 20,
        "base_target_token": 7,
        "seed": 42,
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["sweep_parameter"] == "sequence_length"
    assert len(data["results"]) == 4
    assert "parameter" in data["results"][0]


def test_preset_baseline(client):
    resp = client.post("/api/v1/experiments/preset/baseline")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["final_state"]) == 16  # baseline has 16 slots


def test_preset_unknown(client):
    resp = client.post("/api/v1/experiments/preset/nonexistent")
    assert resp.status_code == 404


def test_list_presets(client):
    resp = client.get("/api/v1/presets")
    assert resp.status_code == 200
    names = [p["name"] for p in resp.json()]
    assert "baseline" in names
    assert "break_the_memory" in names


def test_final_state_always_equals_memory_slots(client):
    """The critical invariant across all valid configs."""
    for k in [2, 4, 8, 16, 32]:
        resp = client.post("/api/v1/experiments", json={
            "sequence_length": 64,
            "memory_slots": k,
            "vocabulary_size": 50,
            "target_token": 3,
            "seed": 99,
        })
        assert resp.status_code == 200
        assert len(resp.json()["final_state"]) == k


def test_final_state_length_invariant_many_combinations(client):
    for sequence_length in [8, 16, 64, 128]:
        for memory_slots in [2, 4, 8, 16]:
            resp = client.post("/api/v1/experiments", json={
                "sequence_length": sequence_length,
                "memory_slots": memory_slots,
                "vocabulary_size": 50,
                "target_token": 7,
                "seed": 42,
            })
            assert resp.status_code == 200
            data = resp.json()
            assert len(data["final_state"]) == memory_slots
            assert len(data["final_state"]) == data["parameters"]["memory_slots"]


def test_query_position_before_target_is_inconclusive(client):
    resp = client.post("/api/v1/experiments", json={
        "sequence_length": 16,
        "memory_slots": 4,
        "vocabulary_size": 20,
        "target_token": 7,
        "target_position": 12,
        "query_position": 5,
        "seed": 9,
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["prediction"]["recall_status"] == "inconclusive"
    assert data["explanation"]["claim_test_result"]["outcome"] == "inconclusive"
