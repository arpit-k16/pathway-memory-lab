# API Contract — Memory Lab Backend

Base URL: `http://localhost:8000`

## 1) GET /health
- Purpose: service liveness check.
- Response: `{ "status": "ok", "service": "memory-lab-backend", "version": "0.1.0" }`

## 2) GET /api/v1/concept
- Purpose: approved topic, claim, learning metadata.
- Response fields:
  - `title`, `approved_topic`, `central_claim`
  - `intended_learner`, `prerequisites[]`, `learning_objectives[]`
  - `limitations[]`, `terminology{}`.

## 3) POST /api/v1/experiments
- Purpose: run one deterministic toy recurrent-memory experiment.
- Request schema:
  - `sequence_length` int [4,500]
  - `memory_slots` int [2,128]
  - `vocabulary_size` int [2,1000]
  - `target_token` int, must be `< vocabulary_size`
  - `interference` float [0,1], default 0.0
  - `seed` int, default 42
  - `target_position` optional int in `[0, sequence_length)`
  - `query_position` optional int in `[0, sequence_length)` (default: final step)
- Behavior:
  - Target token appears exactly once in sequence.
  - Memory state length is always `memory_slots`.
  - Query uses state at `query_position` (or final state if omitted).
- Response schema (major fields):
  - `experiment_id`, `seed`
  - `parameters{...}`
  - `sequence[]`
  - `ground_truth{target_token,target_position,target_occurrences,query_position,target_seen_before_query,...}`
  - `prediction{query_position,target_slot,expected_signature,actual_slot_value,slot_write_count,predicted_token,confidence,recall_status,recovered}`
  - `metrics{correct,accuracy,target_signal,prediction_confidence,memory_utilization,active_slots,collision_count,collision_rate,state_norm,capacity_pressure,slot_write_counts}`
  - `memory_trace[]` with per-step state update, collision flags, `target_signal`, `target_present`
  - `final_state[]`
  - `explanation{mechanism,observation,limitation,claim_test_result{outcome,evidence,scope}}`
- Example request:
```json
{
  "sequence_length": 32,
  "memory_slots": 8,
  "vocabulary_size": 20,
  "target_token": 7,
  "interference": 0.2,
  "seed": 42,
  "query_position": 20
}
```

## 4) GET /api/v1/experiments/{experiment_id}
- Purpose: retrieve a previously executed experiment from in-memory store.
- 404 if missing.

## 5) POST /api/v1/experiments/sweep
- Purpose: vary one parameter and return plot-ready summaries.
- Request schema:
  - `sweep_parameter`: `"sequence_length" | "memory_slots" | "interference"`
  - `sweep_values`: numeric list
  - base params: `base_sequence_length`, `base_memory_slots`, `base_vocabulary_size`, `base_target_token`, `base_interference`, `seed`
- Validation:
  - `sequence_length` sweep values must be integers in [4,500]
  - `memory_slots` sweep values must be integers in [2,128]
  - `interference` sweep values must be floats in [0,1]
  - no silent float→int truncation
- Response:
```json
{
  "sweep_parameter": "memory_slots",
  "results": [
    {
      "parameter": 8,
      "experiment_id": "uuid",
      "correct": true,
      "accuracy": 1.0,
      "collision_rate": 0.31,
      "memory_utilization": 0.88,
      "target_signal": 0.73,
      "capacity_pressure": 4.0
    }
  ]
}
```

## 6) GET /api/v1/presets
- Purpose: list available pedagogical presets.
- Response item:
  - `name`
  - `parameters` (same shape as experiment request)
  - `purpose`
  - `expected_phenomenon`

## 7) POST /api/v1/experiments/preset/{preset_name}
- Purpose: execute one preset.
- 404 for unknown preset.

## 8) GET /api/v1/bdh
- Purpose: educational reference metadata only.
- Explicit separation:
  - `implementation_status = "reference_only"`
  - `not_implemented_by_toy_engine = true`

## 9) GET /api/v1/research
- Purpose: return research source metadata records.
- Fields:
  - `title`, `authors[]`, `year`, `identifier`, `url`, `source_type`, `claim_supported`, `notes`
- Unknown/unverified items are marked with TODO notes.

## Error contract
- Validation errors: HTTP 422 with Pydantic/FastAPI detail.
- Missing experiment/preset: HTTP 404 with clear `detail`.
