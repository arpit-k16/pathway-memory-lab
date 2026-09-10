## Pathway Memory Lab

> **Pathway Project — Explain the Frontier**  
> **Topic:** In-Context Learning with Recurrent Memory

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?logo=vercel)](https://pathway-memory-lab.vercel.app/)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-646CFF?logo=vite)](https://vite.dev/)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)

## 🔗 Links

- **Live artifact:** https://pathway-memory-lab.vercel.app/
- **Source repository:** https://github.com/arpit-k16/pathway-memory-lab
- **Concept summary:** [`docs/concept-summary-v2.pdf.pdf`](docs/concept-summary-v2.pdf.pdf)
- **API contract:** [`backend/API_CONTRACT.md`](backend/API_CONTRACT.md)

---

## 1. Project Overview

**DataForge Memory Lab** is an interactive educational experience for the Pathway **“Explain the Frontier”** challenge.

The project isolates one precise technical idea:

> **A fixed-shape recurrent state can process a sequence of unbounded duration without allocating a new memory slot for every token, but it can still forget through interference.**

Instead of presenting recurrent memory as an abstract diagram, the application gives the learner a small computational system they can manipulate. A token sequence is processed one step at a time through a fixed-size memory state. The learner can change sequence length, memory capacity, interference, and related parameters, observe collisions, inspect the state trace, and query the resulting state.

The project deliberately uses a **transparent toy recurrent-memory mechanism** rather than a trained neural network. This makes the relationship between finite state, collisions, interference, and recall visible.

**Important:** this project is **not BDH, not BDH-CQ, not a language model, and not a benchmark reproduction**. BDH and BDH-CQ are used as frontier research context.

---

## 2. Central Claim

The project teaches the distinction between:

- **constant memory footprint**, and
- **unlimited information retention**.

A recurrent-style system can keep a state whose shape does not grow with sequence length. That does not mean every piece of historical information remains recoverable. As more tokens compete for a finite state, collisions and interference can make previously written information harder or impossible to recover.

### Core takeaway

**Bounded state ≠ bounded sequence length, but bounded state also ≠ perfect memory.**

---

## 3. Learning Objectives

After using the Memory Lab, learners should be able to:

1. Explain how a fixed-size recurrent state can process a sequence without allocating a permanent memory location for every token.
2. Observe how repeated writes to finite memory create collisions.
3. Explain how interference can degrade recall.
4. Compare a query's **ground truth** with the backend's **prediction/recovery result**.
5. Relate memory pressure to collision rate, memory utilization, target signal, confidence, and capacity pressure.
6. Distinguish a simple educational recurrent-memory mechanism from modern learned recurrent-memory architectures.
7. Explain the conceptual relationship to BDH, BDH-CQ, Titans, and Griffin without confusing the toy model with those systems.

---

## 4. Intended Learner

The experience is designed for technically curious learners interested in:

- recurrent neural architectures;
- in-context learning;
- long-context sequence processing;
- memory mechanisms;
- recurrent/state-space approaches to sequence modeling.

### Prerequisites

No machine-learning framework knowledge is required.

Helpful background:

- basic understanding of tokens/sequences;
- familiarity with the idea of a model maintaining a state while reading a sequence;
- basic comfort with simple metrics and parameter changes.

The interface introduces the mechanism before presenting the frontier-research connection.

---

## 5. How the Interactive Experiment Works

The backend implements a deterministic toy recurrent-memory engine.

### Step 1 — Generate a sequence

A token sequence is generated deterministically from a configurable random seed. A target token can be placed at a controlled position.

### Step 2 — Maintain fixed-size memory

The memory state has a configured number of scalar slots. If an experiment uses `K` memory slots, the state remains length `K` throughout the sequence.

### Step 3 — Map tokens to memory

Each token is mapped to a finite slot using deterministic slot mapping:

```text
slot = token % memory_slots
```

The token also has a deterministic signature that contributes to the selected slot.

### Step 4 — Collisions

Different tokens can map to the same slot. When that happens, their updates occupy the same finite state location. The backend explicitly records the collision.

### Step 5 — Interference

The experiment optionally applies controlled interference/noise to updates. This gives the learner a second way to increase memory pressure beyond simply increasing sequence length.

### Step 6 — Trace the state

Every update produces a backend-generated trace containing information such as:

- position;
- token;
- updated slot;
- slot before/after;
- full state;
- state norm;
- collision flag;
- collision count;
- active slots;
- target signal;
- target presence.

The React frontend plays this trace back visually.

### Step 7 — Query the state

At a selected query position, the system attempts to recover the target token.

The response includes:

- ground truth;
- predicted token;
- target slot;
- expected/actual slot value;
- confidence;
- write count;
- recall status;
- recovery result.

This makes the distinction between **what was actually present** and **what the finite state allows the system to recover** explicit.

---

## 6. Learner Controls

The live experiment exposes meaningful memory-pressure variables including:

| Variable | Effect |
|---|---|
| **Sequence length** | Increases the number of sequential updates |
| **Memory slots** | Changes the fixed state capacity |
| **Vocabulary size** | Changes the token space and possible mappings |
| **Interference** | Adds controlled update perturbation |
| **Seed** | Makes the experiment reproducible |
| **Target position** | Controls where the target is introduced |
| **Query position** | Controls when recall is evaluated |

Pedagogical presets include:

- **Baseline**
- **Long Sequence**
- **Low Capacity**
- **High Interference**
- **Break the Memory**

These presets make the core phenomenon easy to reproduce.

---

## 7. Evidence Produced by the Experiment

The toy engine reports measurable quantities including:

- `accuracy`
- `correct`
- `target_signal`
- `prediction_confidence`
- `memory_utilization`
- `active_slots`
- `collision_count`
- `collision_rate`
- `state_norm`
- `capacity_pressure`
- `slot_write_counts`

The project intentionally avoids treating one toy-model run as universal scientific evidence.

The **Break the Memory** regime deliberately combines a long sequence, low memory capacity, and interference so that recall degradation is easy to inspect.

The frontend labels the resulting behavior as **toy-model evidence** and notes that each result is configuration-specific.

---

## 8. Experimental Comparison and Sweep

### Experimental Comparison

The comparison section runs different memory-pressure regimes through the real backend and places their outcomes side by side.

The purpose is to make memory-pressure effects visually comparable, not to claim that one configuration is universally better.

### Parametric Sweep

The sweep endpoint evaluates multiple configurations of a selected parameter and returns plot-ready summaries.

Supported sweep parameters:

- `sequence_length`
- `memory_slots`
- `interference`

The frontend visualizes the returned relationship while explicitly stating that the curve is produced by the toy backend and is **not a general scientific law**.

---

## 9. Architecture

```text
                         ┌──────────────────────────┐
                         │       React / Vite       │
                         │        Frontend          │
                         │                          │
                         │  Controls                │
                         │  State visualization     │
                         │  Trace playback          │
                         │  Query / recall          │
                         │  Diagnostics             │
                         │  Comparison / sweep      │
                         │  BDH / research context │
                         └────────────┬─────────────┘
                                      │ HTTPS / JSON
                                      ▼
                         ┌──────────────────────────┐
                         │        FastAPI           │
                         │        Backend           │
                         │                          │
                         │  Experiment engine      │
                         │  Fixed-size memory      │
                         │  Metrics                │
                         │  Reproducibility       │
                         │  Presets               │
                         │  Research metadata     │
                         └──────────────────────────┘
```

### Source of truth

The **FastAPI backend is the computational source of truth** for production experiments. The frontend renders the backend responses rather than silently fabricating final experiment results.

---

## 10. Repository Structure

```text
DataForge/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── bdh.py
│   │   │   ├── concepts.py
│   │   │   ├── experiments.py
│   │   │   ├── health.py
│   │   │   └── presets.py
│   │   ├── core/
│   │   │   ├── experiment.py
│   │   │   ├── memory.py
│   │   │   ├── metrics.py
│   │   │   └── reproducibility.py
│   │   ├── data/
│   │   │   └── research.py
│   │   ├── config.py
│   │   ├── main.py
│   │   └── schemas.py
│   ├── app/tests/
│   ├── API_CONTRACT.md
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── comparison/
│   │   │   ├── controls/
│   │   │   ├── diagnostics/
│   │   │   ├── experiment/
│   │   │   ├── hero/
│   │   │   ├── layout/
│   │   │   ├── query/
│   │   │   ├── research/
│   │   │   └── sweep/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── types/
│   │   └── utils/
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.ts
├── docs/
│   └── concept-summary-v2.pdf.pdf
├── README.md
└── Pathway PS.pdf
```

---

## 11. Major Frontend Components

- **`MemoryLab.tsx`** — composes the complete learning journey.
- **Hero** — introduces the central claim and learning question.
- **Experiment** — token stream, fixed-size memory, collision alerts, playback, and state trace.
- **Query & Recall** — query operation and prediction vs. ground truth.
- **Diagnostics** — memory-health metrics and interpretation.
- **Pressure Sandbox** — additional parameter manipulation.
- **Comparison** — backend-generated comparison of memory-pressure regimes.
- **Sweep** — backend-generated parameter sweep visualization.
- **Theory & BDH** — conceptual bridge to frontier research.
- **Limitations & Sources** — scope, limitations, and research basis.

---

## 12. Major Backend Components

- **`app/core/memory.py`** — fixed-size slot state and token-to-slot update mechanism.
- **`app/core/experiment.py`** — sequence generation, target placement, updates, querying, and experiment output.
- **`app/core/metrics.py`** — collisions, utilization, target signal, confidence, and capacity pressure.
- **`app/core/reproducibility.py`** — deterministic seed behavior.
- **`app/api/experiments.py`** — experiment and sweep endpoints.
- **`app/api/presets.py`** — pedagogical presets.
- **`app/api/bdh.py`** — BDH/BDH-CQ reference metadata only.
- **`app/data/research.py`** — research-source metadata.

---

## 13. API

| Endpoint | Purpose |
|---|---|
| `GET /health` | Service liveness |
| `GET /api/v1/concept` | Claim, learner, objectives, terminology |
| `POST /api/v1/experiments` | Run one experiment |
| `GET /api/v1/experiments/{experiment_id}` | Retrieve an experiment |
| `POST /api/v1/experiments/sweep` | Run a parameter sweep |
| `GET /api/v1/presets` | List pedagogical presets |
| `POST /api/v1/experiments/preset/{preset_name}` | Run a preset |
| `GET /api/v1/bdh` | BDH/BDH-CQ reference metadata |
| `GET /api/v1/research` | Research source metadata |

Full request/response details are documented in [`backend/API_CONTRACT.md`](backend/API_CONTRACT.md).

---

## 14. Live vs. Synthetic vs. Precomputed vs. Animated

### Live computation

The deployed FastAPI backend computes:

- experiments;
- presets;
- comparisons;
- parameter sweeps;
- memory traces;
- predictions;
- metrics.

### Synthetic data

The experiment uses generated token sequences and deterministic token signatures. It does not use an external real-world dataset.

### Animated presentation

The frontend animates/replays the backend-generated state trace for teaching purposes.

### Reference content

The BDH/BDH-CQ and research sections provide explanatory/reference material. They are not live implementations of the cited research systems.

There is **no trained neural model** behind the toy experiment.

---

## 15. Reproducibility

Experiments are deterministic with respect to their configured parameters and seed.

The same:

```text
sequence_length
memory_slots
vocabulary_size
target_token
interference
seed
target_position
query_position
```

produces the same generated experiment behavior.

Changing the seed changes the generated sequence and can change the observed outcome.

---

## 16. Run Locally

### Backend

Requirements:

- Python 3.11+
- pip

```bash
cd backend
python -m venv .venv
```

**Windows:**

```bash
.venv\Scripts\activate
```

**macOS / Linux:**

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at:

```text
http://localhost:8000
```

Swagger UI:

```text
http://localhost:8000/docs
```

### Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

For local development:

```text
VITE_API_BASE_URL=http://localhost:8000
```

For production, `VITE_API_BASE_URL` must point to the publicly deployed FastAPI backend.

---

## 17. Docker Backend

The backend includes a Dockerfile.

```bash
cd backend
docker build -t dataforge-memory-lab-backend .
docker run -p 8000:8000 dataforge-memory-lab-backend
```

---

## 18. Tests

The backend contains tests covering:

- health;
- memory behavior;
- experiments;
- validation;
- reproducibility;
- BDH reference metadata.

Run:

```bash
cd backend
pytest -q
```

---

## 19. Production Deployment

The public artifact uses:

```text
Frontend → Vercel
Backend  → Render / public FastAPI service
```

The frontend reads:

```text
VITE_API_BASE_URL
```

from its production environment.

The backend uses:

```text
CORS_ORIGINS
```

to allow the deployed frontend origin.

**Important:** `localhost:8000` is only for local development. A public deployment must use the public FastAPI URL.

---

## 20. BDH / BDH-CQ Connection

The project uses recurrent fixed-state memory as a conceptual bridge to frontier work.

### BDH

**The Dragon Hatchling (BDH)** describes a substantially more sophisticated learned, scale-free architecture based on locally interacting neuron particles and inference-time memory through synaptic plasticity.

### BDH-CQ

**BDH-CQ** combines in-context learning with recurrent latent reasoning. Inputs update recurrent memory during inference, after which iterative latent computation is used to answer a query.

### Explicit boundary

The Memory Lab does **not**:

- implement BDH;
- implement BDH-CQ;
- reproduce their training procedures;
- reproduce their benchmark results;
- claim equivalent architecture or performance.

The toy model uses deterministic scalar slots and controlled interference solely to make the broader recurrent-memory idea experimentally visible.

---

## 21. Limitations

The model is deliberately simplified.

- **Representation:** scalar memory slots rather than learned high-dimensional representations.
- **Addressing:** deterministic slot mapping rather than learned memory addressing.
- **Dynamics:** deterministic updates with optional controlled interference rather than learned recurrent dynamics.
- **Evidence:** individual runs demonstrate this toy mechanism and do not establish universal laws about recurrent neural networks.
- **Storage:** experiment results are held in an in-memory registry rather than a persistent database.
- **Research connection:** the BDH/BDH-CQ section is conceptual/reference material; the toy engine does not reproduce those systems.

These limitations are intentionally disclosed because they are part of the educational value of the artifact.

---

## 22. Research Foundation

The project is grounded in recent primary research from 2022–2026.

### 1. The Dragon Hatchling (BDH)

**Adrian Kosowski, Przemysław Uznański, Jan Chorowski, Zuzanna Stamirowska, Michał Bartoszkiewicz (2025)**

*The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain*

https://arxiv.org/abs/2509.26507

Used for the explanation of BDH, scale-free/local interactions, and inference-time memory through synaptic plasticity.

### 2. BDH-CQ

**Björn Engdahl, Adrian Kosowski, Jan Chorowski, Zuzanna Stamirowska, Przemysław Uznański, Junlin Jiang, Rohan Phadke, Remigiusz Kinas, Richard Zhong (2026)**

*BDH-CQ: In-Context Learning with Recurrent Latent Reasoning*

https://arxiv.org/abs/2608.09888

Used for the explanation of inference-time recurrent memory updates and iterative latent reasoning.

### 3. Titans

**Ali Behrouz, Peilin Zhong, Vahab Mirrokni (2024/2025)**

*Titans: Learning to Memorize at Test Time*

https://arxiv.org/abs/2501.00663

Used as contextual research on fixed-size recurrent memory, neural long-term memory, and test-time memorization.

### 4. Griffin

**Soham De et al. (2024)**

*Griffin: Mixing Gated Linear Recurrences with Local Attention for Efficient Language Models*

https://arxiv.org/abs/2402.19427

Used as contextual research on gated linear recurrences and recurrent-attention hybrids.

### 5. RecurrentGemma

**Aleksandar Botev et al. (2024)**

*RecurrentGemma: Moving Past Transformers for Efficient Open Language Models*

https://arxiv.org/abs/2404.07839

Provides additional context on practical recurrent language models using the Griffin architecture.

---

## 23. Source, Asset, and Dependency Record

| Item | Role | Source / Location |
|---|---|---|
| DataForge logo | Project branding | Supplied project asset |
| IIT Kharagpur logo | Institutional/project branding | Supplied project asset |
| Concept Summary PDF | Submission material | `docs/concept-summary-v2.pdf.pdf` |
| Pathway challenge brief | Requirements/reference | `Pathway PS.pdf` |
| BDH | Primary research | arXiv:2509.26507 |
| BDH-CQ | Primary research | arXiv:2608.09888 |
| Titans | Primary research | arXiv:2501.00663 |
| Griffin | Primary research | arXiv:2402.19427 |
| RecurrentGemma | Primary research/context | arXiv:2404.07839 |
| React | Frontend | `frontend/package.json` |
| React DOM | Frontend | `frontend/package.json` |
| Vite | Build/dev tooling | `frontend/package.json` |
| TypeScript | Frontend language/tooling | `frontend/package.json` |
| Tailwind CSS | Styling | `frontend/package.json` |
| FastAPI | Backend API | `backend/requirements.txt` |
| Uvicorn | ASGI server | `backend/requirements.txt` |
| Pydantic | Validation | `backend/requirements.txt` |
| pydantic-settings | Configuration | `backend/requirements.txt` |
| NumPy | Numerical operations | `backend/requirements.txt` |
| Pytest | Testing | `backend/requirements.txt` |
| HTTPX | API/test client | `backend/requirements.txt` |

Dependency versions and package metadata are recorded in:

- `frontend/package.json`
- `frontend/package-lock.json`
- `backend/requirements.txt`

Third-party dependencies retain their respective licenses. The project does **not** claim a separate open-source license unless a `LICENSE` file is added.

---

## 24. AI Assistance Disclosure

AI assistance was used during the development workflow for:

- project ideation and refinement;
- code implementation assistance;
- debugging;
- frontend/backend integration;
- documentation;
- research organization;
- copy editing and presentation refinement.

The final artifact was reviewed as an integrated project. The computational mechanism is explicitly documented, and research claims are tied to cited primary sources.

AI assistance should not be interpreted as independent scientific validation of the toy experiment or of the cited research.

---

## 25. Submission Materials

The project package provides:

- a public interactive artifact;
- a public source repository;
- a one-page concept summary PDF;
- this README;
- API documentation;
- reproducible local setup instructions;
- research sources;
- limitations;
- asset/dependency provenance;
- AI assistance disclosure.

---

## 26. Learning Journey

```text
Question
   ↓
Fixed-size recurrent state
   ↓
Process tokens sequentially
   ↓
Observe collisions / interference
   ↓
Query memory
   ↓
Compare prediction with ground truth
   ↓
Increase memory pressure
   ↓
Observe recall degradation
   ↓
Connect the intuition to BDH / BDH-CQ
   ↓
Understand the limitation of the toy model
```

### Final takeaway

> **A fixed-size recurrent state can keep processing an arbitrarily long sequence without growing a token-sized memory, but finite state does not guarantee perfect retention. Interference can make information disappear from the recoverable state.**

---

## License

No project-specific open-source license is currently asserted unless a `LICENSE` file is present in the repository. Third-party dependencies retain their respective licenses.
