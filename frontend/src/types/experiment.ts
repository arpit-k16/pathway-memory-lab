/*
 * Domain types for Memory Lab.
 *
 * These types describe the shape of an experiment both for the current
 * client-side demo simulation AND for the future backend API
 * (POST /api/v1/experiments/run, POST /api/v1/experiments/sweep).
 * Keeping them centralized here means Phase 2 can swap the data source
 * (demoData / local simulation -> real API responses) without touching
 * component code.
 */
/* Legacy demo types below are retained only for non-production presentation components. */

export interface ExperimentRequest { sequence_length:number; memory_slots:number; vocabulary_size:number; target_token:number; interference:number; seed:number; target_position?:number | null; query_position?:number | null }
export interface TraceItem { position:number; token:number; updated_slot:number; slot_before:number; slot_after:number; state:number[]; state_norm:number; collision:boolean; collision_count:number; active_slots:number; target_signal?:number | null; target_present?:boolean | null }
export interface ExperimentResponse { experiment_id:string; seed:number; parameters:Omit<ExperimentRequest,'seed'>; sequence:number[]; target_token:number; ground_truth:{target_token:number;target_position:number;present_in_sequence:boolean;target_occurrences:number;query_position:number;target_seen_before_query:boolean}; prediction:{query_position:number;target_token:number;target_slot:number;expected_signature:number;actual_slot_value:number;slot_write_count:number;confidence:number;predicted_token:number|null;recall_status:'success'|'degraded'|'failure'|'inconclusive';recovered:boolean}; correct:boolean; metrics:{correct:boolean;accuracy:number;target_signal:number;prediction_confidence:number;memory_utilization:number;active_slots:number;collision_count:number;collision_rate:number;state_norm:number;capacity_pressure:number;slot_write_counts:number[]}; memory_trace:TraceItem[]; final_state:number[]; explanation:{mechanism:string;observation:string;limitation:string;claim_test_result:{outcome:'recall_success'|'recall_degraded'|'inconclusive';evidence:string;scope:string}} }
export interface ApiPreset { name:string; parameters:ExperimentRequest; purpose:string; expected_phenomenon:string }
export interface SweepResponse { sweep_parameter:string; results:{parameter:number;experiment_id:string;correct:boolean;accuracy:number;collision_rate:number;memory_utilization:number;target_signal:number;capacity_pressure:number}[] }
export interface BdhResponse { implementation_status:string;not_implemented_by_toy_engine:boolean;disclaimer:string;entries:{name:string;type:string;role:string;relation_to_topic:string;not_implemented_by_toy_engine:boolean;sources:string[]}[] }
export interface ResearchSource { title:string;authors:string[];year:number|null;identifier:string|null;url:string|null;source_type:string;claim_supported:string|null;notes:string }

/** Configuration a learner can control before running an experiment. */
export interface ExperimentConfig {
  /** Sequence length T - number of tokens fed into the recurrent state. */
  seqLen: number;
  /** Number of fixed memory slots K. */
  slotsK: number;
  /** Interference / decay factor tau, in [0, 1]. */
  interference: number;
  /** RNG seed used to generate the (deterministic) token sequence. */
  seed: number;
  /** The scalar value of the token we want the memory to recall later. */
  targetVal: number;
  /** Position (index) at which the target token is injected. */
  targetPos: number;
  /** Backend query position (the old demo had an implicit final query). */
  queryPos: number;
  /** Backend vocabulary size. */
  vocabularySize: number;
}

/** A single memory register slot at a point in time. */
export interface MemorySlot {
  id: number;
  /** Most recently written scalar value in this slot (accumulated). */
  val: number;
  /** The last discrete token routed into this slot, or null if untouched. */
  lastToken: number | null;
  /** Whether this slot currently holds the target token's signal. */
  holdsTarget: boolean;
  /** Residual strength of the target signal in this slot, 0..1. */
  targetSignal: number;
  /** Number of times this slot has been overwritten/contended. */
  collisionCount: number;
}

/** A logged collision event (a token overwrote another token's slot). */
export interface CollisionEvent {
  step: number;
  slot: number;
  token: number;
}

/** One frame of the trace: the full memory state after processing step N. */
export interface MemoryTraceStep {
  step: number;
  /** Snapshot of every slot after this step was applied. */
  slots: MemorySlot[];
  /** All collisions recorded so far, up to and including this step. */
  collisions: CollisionEvent[];
  /** Index of the slot touched by this step (null for the initial frame). */
  activeSlot: number | null;
  /** Whether this step caused a collision. */
  hadCollision: boolean;
  /** Human-readable description of what happened at this step. */
  eventText: string;
}

/** Ground truth vs. decoded model output after a full trace completes. */
export interface ExperimentPrediction {
  groundTruthToken: number;
  groundTruthPos: number;
  decodedToken: number | null;
  confidence: number;
  status: 'success' | 'degraded' | 'failure';
}

/** Aggregate metrics summarizing a completed experiment run. */
export interface ExperimentMetrics {
  totalCollisions: number;
  capacityPressure: number;
  slotUtilizationPct: number;
  targetRetention: number;
}

/** A full experiment: config + generated tokens + trace + outcome. */
export interface Experiment {
  id: string;
  label: string;
  config: ExperimentConfig;
  tokens: number[];
  trace: MemoryTraceStep[];
  prediction: ExperimentPrediction;
  metrics: ExperimentMetrics;
}

/** A curated one-click configuration for the sandbox. */
export interface Preset {
  id: string;
  label: string;
  description: string;
  config: Pick<ExperimentConfig, 'seqLen' | 'slotsK' | 'interference'>;
  /** Visually flag destructive/extreme presets (e.g. "Break the Memory"). */
  tone?: 'default' | 'danger';
}

/** One point on the capacity vs. recall parametric sweep chart. */
export interface SweepResult {
  slotsK: number;
  recallProbability: number;
  isInflectionPoint?: boolean;
}

/** Result of testing the central falsifiable claim against a regime. */
export interface ClaimTestResult {
  regimeLabel: string;
  status: 'success' | 'degraded' | 'failure';
  slotsK: number;
  seqLen: number;
  capacityPressure: number;
  collisions: number;
  confidencePct: number;
  signalLossPct: number;
  description: string;
  /** SVG path data for the small retention curve (already computed/demo). */
  retentionCurvePath: string;
  retentionCurveFillPath: string;
}

/** A bibliography entry for the Sources section. */
export interface SourceReference {
  id: string;
  authors: string;
  year: string;
  citation: string;
}
