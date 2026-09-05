"""Validation tests — ensure bad inputs produce proper HTTP errors."""


def test_sequence_length_too_small(client):
    resp = client.post("/api/v1/experiments", json={
        "sequence_length": 2,
        "memory_slots": 4,
        "vocabulary_size": 10,
        "target_token": 3,
    })
    assert resp.status_code == 422


def test_sequence_length_too_large(client):
    resp = client.post("/api/v1/experiments", json={
        "sequence_length": 9999,
        "memory_slots": 4,
        "vocabulary_size": 10,
        "target_token": 3,
    })
    assert resp.status_code == 422


def test_memory_slots_too_small(client):
    resp = client.post("/api/v1/experiments", json={
        "sequence_length": 8,
        "memory_slots": 1,
        "vocabulary_size": 10,
        "target_token": 3,
    })
    assert resp.status_code == 422


def test_memory_slots_too_large(client):
    resp = client.post("/api/v1/experiments", json={
        "sequence_length": 8,
        "memory_slots": 999,
        "vocabulary_size": 10,
        "target_token": 3,
    })
    assert resp.status_code == 422


def test_vocabulary_too_small(client):
    resp = client.post("/api/v1/experiments", json={
        "sequence_length": 8,
        "memory_slots": 4,
        "vocabulary_size": 1,
        "target_token": 0,
    })
    assert resp.status_code == 422


def test_vocabulary_too_large(client):
    resp = client.post("/api/v1/experiments", json={
        "sequence_length": 8,
        "memory_slots": 4,
        "vocabulary_size": 5000,
        "target_token": 3,
    })
    assert resp.status_code == 422


def test_interference_negative(client):
    resp = client.post("/api/v1/experiments", json={
        "sequence_length": 8,
        "memory_slots": 4,
        "vocabulary_size": 10,
        "target_token": 3,
        "interference": -0.1,
    })
    assert resp.status_code == 422


def test_interference_above_one(client):
    resp = client.post("/api/v1/experiments", json={
        "sequence_length": 8,
        "memory_slots": 4,
        "vocabulary_size": 10,
        "target_token": 3,
        "interference": 1.5,
    })
    assert resp.status_code == 422


def test_target_token_exceeds_vocabulary(client):
    resp = client.post("/api/v1/experiments", json={
        "sequence_length": 8,
        "memory_slots": 4,
        "vocabulary_size": 10,
        "target_token": 15,
    })
    assert resp.status_code == 422


def test_invalid_query_position(client):
    resp = client.post("/api/v1/experiments", json={
        "sequence_length": 8,
        "memory_slots": 4,
        "vocabulary_size": 10,
        "target_token": 3,
        "query_position": 99,
    })
    assert resp.status_code == 422


def test_invalid_target_position(client):
    resp = client.post("/api/v1/experiments", json={
        "sequence_length": 8,
        "memory_slots": 4,
        "vocabulary_size": 10,
        "target_token": 3,
        "target_position": 99,
    })
    assert resp.status_code == 422


def test_invalid_sweep_parameter(client):
    resp = client.post("/api/v1/experiments/sweep", json={
        "sweep_parameter": "invalid_param",
        "sweep_values": [1, 2, 3],
    })
    assert resp.status_code == 422


def test_sweep_memory_slots_rejects_fractional_values(client):
    resp = client.post("/api/v1/experiments/sweep", json={
        "sweep_parameter": "memory_slots",
        "sweep_values": [4, 6.5, 8],
        "base_sequence_length": 16,
        "base_vocabulary_size": 20,
        "base_target_token": 7,
    })
    assert resp.status_code == 422


def test_sweep_sequence_length_out_of_range(client):
    resp = client.post("/api/v1/experiments/sweep", json={
        "sweep_parameter": "sequence_length",
        "sweep_values": [8, 600],
        "base_memory_slots": 8,
        "base_vocabulary_size": 20,
        "base_target_token": 7,
    })
    assert resp.status_code == 422
