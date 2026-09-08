# DataForge — Memory Lab

## Approved topic and claim

**In-Context Learning with Recurrent Memory.** Memory Lab is an educational, interactive experiment around one careful claim: a fixed-shape recurrent state can process an arbitrarily long token stream without allocating a permanent location for every token, while faithful recall can degrade through finite capacity, collisions, and interference.

## Learner journey

For technically curious learners, the application makes the claim visible, plays a real backend-generated trace, invites the learner to use **break the memory**, compares ground truth with the model output, and then changes one variable in the sandbox. The displayed run is reproducible from its seed and configuration.

## Architecture and data flow

React + TypeScript + Vite renders the Stitch-derived interface. A typed API client calls FastAPI. The backend's transparent toy engine generates the sequence, state trace, prediction, and metrics; React only selects trace frames for playback. `VITE_API_BASE_URL` configures the API base URL (default `http://localhost:8000`).

The toy state has a fixed number of scalar slots. Tokens are processed sequentially, map to finite slots, and contribute deterministic signatures. Repeated writes create explicit superposition/collisions; optional interference perturbs updates. Recall compares the target with the backend prediction at the configured query position. A single run is experiment-specific, not a universal result.

## BDH / BDH-CQ connection

This is **not** BDH, BDH-CQ, a trained neural network, or a benchmark reproduction. It isolates one conceptual pressure shared with recurrent-memory research: information must be maintained and updated in state rather than retained as an explicit token list. BDH is a substantially richer learned architecture; BDH-CQ adds recurrent latent reasoning.

Primary research sources: [The Dragon Hatchling (BDH), arXiv:2509.26507](https://arxiv.org/abs/2509.26507); [BDH-CQ, arXiv:2608.09888](https://arxiv.org/abs/2608.09888); [Titans, arXiv:2501.00663](https://arxiv.org/abs/2501.00663); and [Griffin, arXiv:2402.19427](https://arxiv.org/abs/2402.19427).

## Reproducibility, setup, and testing

The same backend parameters and seed reproduce the sequence and trace. Each result exposes seed, sequence length, memory slots, interference, target position, query position, prediction, and collision metrics; the UI can copy this configuration.

```powershell
cd backend; ..\.venv\Scripts\python.exe -m uvicorn app.main:app --port 8000
cd frontend; npm ci; npm run dev
```

Run `cd backend; ..\.venv\Scripts\python.exe -m pytest app\tests -q`, then `cd frontend; npm run lint; npx tsc -b --noEmit; npm run build`.

## Provenance and disclosure

Live content is FastAPI experiment output. Synthetic content is the deterministic toy sequence/state data. Animated content is frontend playback of a backend trace. Research content is the primary sources named above. See [docs/provenance.md](docs/provenance.md) and [docs/ai-assistance.md](docs/ai-assistance.md). Third-party code is governed by each dependency's published license; Material Symbols/icons and project fonts are used through the existing frontend asset/design setup. AI coding tools assisted implementation and debugging; they are not an evidence source.
