# Memory Lab Backend

## Purpose
Educational FastAPI backend for "Explain the Frontier" experiments on fixed-size recurrent memory.

## Approved Pathway Topic
In-Context Learning with Recurrent Memory

## Central Claim
A fixed-size recurrent state can carry useful information across increasingly long sequences without allocating a new memory slot for every token, but as sequence length and interference increase relative to memory capacity, recall can degrade.

## Learning Objectives
- Understand fixed-size recurrent state updates.
- Observe collisions/interference in bounded memory.
- Compare low-pressure vs high-pressure memory regimes.

## Architecture
- FastAPI app with stateless HTTP APIs.
- In-memory experiment registry (no DB).
- Core modules:
  - `app/core/reproducibility.py`
  - `app/core/memory.py`
  - `app/core/experiment.py`
  - `app/core/metrics.py`

## Recurrent Memory Mechanism
- State is a fixed-length vector (`len(state) == memory_slots` always).
- Each token maps to `slot = token % memory_slots`.
- Token signature is deterministic and added to that slot.
- Multiple tokens can collide and superpose in one slot.
- Optional noise (`interference`) perturbs slot updates.

## Experiment Design
- Sequence is generated deterministically from seed.
- Target token appears exactly once.
- Optional `target_position` controls insertion point.
- Optional `query_position` controls when recall is queried.

## Metrics
- `accuracy`, `correct`
- `target_signal`, `prediction_confidence`
- `memory_utilization`, `active_slots`
- `collision_count`, `collision_rate`
- `state_norm`
- `capacity_pressure = sequence_length / memory_slots`

## Reproducibility
- Same parameters + same seed => identical sequence, trace, metrics.
- Different seed changes generated sequence and often outcomes.

## API
See [API_CONTRACT.md](./API_CONTRACT.md).

## Running Locally
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Running Tests
```bash
cd backend
pytest -q
```

## Swagger/OpenAPI
- Swagger UI: `http://localhost:8000/docs`
- OpenAPI JSON: `http://localhost:8000/openapi.json`

## Toy Model Disclaimer
This backend is a transparent toy associative/recurrent memory model for teaching. It is not a neural network and not a production LLM.

## BDH/BDH-CQ Separation
`/api/v1/bdh` is reference metadata only. The toy engine does not implement BDH or BDH-CQ.

## Research Sources
`/api/v1/research` returns metadata entries; unverified records remain explicitly marked TODO.

## Limitations
- Scalar-slot toy representation, no learned parameters.
- Single-run accuracy is not a broad scientific proof.
- In-memory experiment storage is non-persistent.

## Future Work
- Stitch frontend integration and visualization UX.
- Multi-run aggregate studies and confidence intervals.
- Verified BDH/BDH-CQ educational module with grounded citations.
