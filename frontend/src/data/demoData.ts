import type { ClaimTestResult, ExperimentConfig, Preset, SourceReference, SweepResult } from '../types/experiment';

/**
 * ALL hardcoded demo/placeholder values for Memory Lab live in this file.
 * Components must always receive this data through props/state - never
 * inline it themselves. When Phase 2 wires up the backend, most of this
 * file is replaced by API responses; ExperimentConfig-shaped data keeps
 * working unchanged.
 */

/** The default experiment configuration shown on first load. */
export const DEFAULT_CONFIG: ExperimentConfig = {
  seqLen: 16,
  slotsK: 8,
  interference: 0.15,
  seed: 42,
  targetVal: 7,
  targetPos: 3,
  queryPos: 15,
  vocabularySize: 20,
};

export const SEQ_LEN_RANGE = { min: 8, max: 128, step: 8 };
export const SLOTS_K_RANGE = { min: 2, max: 16, step: 2 };
export const INTERFERENCE_RANGE = { min: 0, max: 1, step: 0.05 };

export const PLAYBACK_SPEEDS = [0.5, 1.0, 2.0, 5.0];

export const PRESETS: Preset[] = [
  {
    id: 'baseline',
    label: '01 Baseline',
    description: 'Seq:16, K:8, \u03c4:0.10',
    config: { seqLen: 16, slotsK: 8, interference: 0.1 },
  },
  {
    id: 'long',
    label: '02 Long Sequence',
    description: 'Seq:64, K:8, \u03c4:0.20',
    config: { seqLen: 64, slotsK: 8, interference: 0.2 },
  },
  {
    id: 'capacity',
    label: '03 Low Capacity',
    description: 'Seq:32, K:4, \u03c4:0.30',
    config: { seqLen: 32, slotsK: 4, interference: 0.3 },
  },
  {
    id: 'interference',
    label: '04 Interfere',
    description: 'Seq:32, K:8, \u03c4:0.80',
    config: { seqLen: 32, slotsK: 8, interference: 0.8 },
  },
  {
    id: 'break',
    label: '05 Break Memory',
    description: 'Seq:128, K:4, \u03c4:0.65',
    config: { seqLen: 128, slotsK: 4, interference: 0.65 },
    tone: 'danger',
  },
];

/** Section 06 - two fixed illustrative regimes used for side-by-side compare. */
export const COMPARISON_REGIMES: ClaimTestResult[] = [
  {
    regimeLabel: 'REGIME A: LOW PRESSURE',
    status: 'success',
    slotsK: 16,
    seqLen: 16,
    capacityPressure: 1.0,
    collisions: 1,
    confidencePct: 94.2,
    signalLossPct: 6,
    description:
      'Each slot accommodates near-orthogonal token embeddings. Stochastic collisions remain isolated (typically \u2264 1 collision across trace).',
    retentionCurvePath: 'M 0 10 Q 50 12, 100 15 T 200 20',
    retentionCurveFillPath: 'M 0 10 Q 50 12, 100 15 T 200 20 L 200 60 L 0 60 Z',
  },
  {
    regimeLabel: 'REGIME B: HIGH PRESSURE',
    status: 'failure',
    slotsK: 4,
    seqLen: 128,
    capacityPressure: 32.0,
    collisions: 86,
    confidencePct: 4.1,
    signalLossPct: 96,
    description:
      'Catastrophic representation contention. Multiple tokens repeatedly overwrite identical registers, obliterating early target signal.',
    retentionCurvePath: 'M 0 10 Q 30 18, 60 48 T 200 58',
    retentionCurveFillPath: 'M 0 10 Q 30 18, 60 48 T 200 58 L 200 60 L 0 60 Z',
  },
];

/** Section 07/08 - demo parametric sweep (K vs recall probability, T=32 fixed). */
export const SWEEP_DATA: SweepResult[] = [
  { slotsK: 2, recallProbability: 0.03 },
  { slotsK: 4, recallProbability: 0.12 },
  { slotsK: 8, recallProbability: 0.42, isInflectionPoint: true },
  { slotsK: 12, recallProbability: 0.79 },
  { slotsK: 16, recallProbability: 0.93 },
  { slotsK: 24, recallProbability: 0.97 },
];

export const SWEEP_META = {
  sequenceLength: 32,
  monteCarloIterations: 1000,
  inflectionLabel: 'Inflection Point: K = 8 slots for T = 32 tokens',
  inflectionNote: 'T/K \u2248 4.0: Rapid entropy jump',
};

export const SOURCES: SourceReference[] = [
  {
    id: 'src-01',
    authors: 'Gu, Dao, et al.',
    year: '2023',
    citation: '"Mamba: Linear-Time Sequence Modeling with Selective State Spaces." arXiv:2312.00752.',
  },
  {
    id: 'src-02',
    authors: 'Vaswani, et al.',
    year: '2017',
    citation: '"Attention Is All You Need." NeurIPS 2017. O(N\u00b2) KV cache dynamics and context memory.',
  },
  {
    id: 'src-03',
    authors: 'BDH Research Notes',
    year: '2024',
    citation: 'Block-Diagonal Recurrent Representations and State Contention in Long-Context Inference.',
  },
  {
    id: 'src-04',
    authors: 'Miller, G. A.',
    year: '1956',
    citation: '"The Magical Number Seven, Plus or Minus Two: Some Limits on Our Capacity for Processing Information."',
  },
];

export const NAV_SECTIONS = [
  { id: 'the-question', label: '01 The Question' },
  { id: 'live-experiment', label: '02 Live Experiment' },
  { id: 'query-and-recall', label: '03 Query & Recall' },
  { id: 'diagnostics', label: '04 Diagnostics' },
  { id: 'pressure-sandbox', label: '05 Pressure Sandbox' },
  { id: 'comparison', label: '06 Comparison' },
  { id: 'sweep-analysis', label: '07 Sweep Analysis' },
  { id: 'frontier-and-bdh', label: '08 Frontier & BDH' },
  { id: 'limitations-and-sources', label: '09 Limitations & Sources' },
] as const;
