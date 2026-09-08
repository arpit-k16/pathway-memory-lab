# Implementation Plan

## Goal
Build a fully functional backend that implements a deterministic recurrent memory engine, experiment runner, metrics, FastAPI endpoints, tests, documentation, and Docker support as specified in the project brief.

## High‑Level Steps
1. **Core Engine** (`backend/core/memory.py`)
   - `RecurrentMemoryEngine` with deterministic bucket hashing, state vector, trace generation.
2. **Experiment Logic** (`backend/core/experiment.py`)
   - `run_experiment` validating parameters, generating deterministic sequence, processing with engine, computing metrics, building explanation.
3. **Metrics** (`backend/core/metrics.py`)
   - Functions to compute accuracy, collisions, utilization, state norm, etc.
4. **Reproducibility Helper** (`backend/core/reproducibility.py`)
   - Seeded NumPy RNG wrapper returning deterministic sequence and noise.
5. **API Schemas** (`backend/app/schemas.py`)
   - Pydantic models for requests/responses.
6. **FastAPI Endpoints** (`backend/app/api/*.py`)
   - Health, concept, experiments (run, get, sweep), presets, BDH, research.
7. **In‑Memory Registry** (`backend/app/api/experiments.py`)
   - Store results by UUID for retrieval.
8. **Presets Definition** (`backend/app/api/presets.py`)
   - Baseline, long_sequence, low_capacity, high_interference, break_the_memory.
9. **BDH Reference Module** (`backend/app/api/bdh.py`)
   - Static placeholder data distinguishing toy engine from BDH.
10. **Research Metadata** (`backend/app/api/research.py`)
    - Structured placeholder entries with TODO notes.
11. **Tests** (`backend/tests/*.py`)
    - Coverage of engine, reproducibility, API endpoints, validation, invariants.
12. **README & API Contract** (`backend/README.md`, `backend/API_CONTRACT.md`)
    - Documentation, running instructions, endpoint specs.
13. **Dockerfile** (`backend/Dockerfile`)
    - Minimal image using python:3.11‑slim.
14. **CORS Configuration** (`backend/app/config.py`)
    - Allow `http://localhost:3000` and `http://localhost:5173`.

## File Structure (to be created/modified)
```
backend/
├─ app/
│  ├─ __init__.py
│  ├─ main.py
│  ├─ config.py
│  ├─ schemas.py
│  └─ api/
│     ├─ __init__.py
│     ├─ health.py
│     ├─ experiments.py
│     ├─ concepts.py
│     ├─ bdh.py
│     ├─ presets.py
│     └─ research.py
│  └─ core/
│     ├─ __init__.py
│     ├─ memory.py
│     ├─ experiment.py
│     ├─ metrics.py
│     └─ reproducibility.py
│  └─ data/
│     └─ __init__.py
├─ tests/
│  ├─ test_health.py
│  ├─ test_memory.py
│  ├─ test_experiments.py
│  ├─ test_reproducibility.py
│  ├─ test_validation.py
│  └─ test_bdh.py
├─ requirements.txt
├─ README.md
├─ API_CONTRACT.md
├─ .env.example
└─ Dockerfile
```

## Open Issues / Decisions Needed
- **Preset descriptions**: brief educational purpose texts.
- **Research sources**: placeholder TODO entries.
- **Explanation wording**: ensure it reflects observed metrics.

## Request for Feedback
- Confirm the outlined file structure and order of implementation.
- Approve any additional minor files (e.g., `backend/app/api/__init__.py` imports).
- Let us know if any preset parameters should be adjusted.

*Please review and approve so we can proceed with code generation.*
