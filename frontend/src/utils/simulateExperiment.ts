import type {
  ExperimentConfig,
  ExperimentMetrics,
  ExperimentPrediction,
  MemorySlot,
  MemoryTraceStep,
} from '../types/experiment';

/**
 * This module is a faithful port of the deterministic client-side engine
 * that shipped inside the original Stitch prototype's inline <script>.
 * It runs entirely in the browser (no network calls) - exactly like the
 * prototype did - and is isolated here so Phase 2 can replace it with a
 * call to POST /api/v1/experiments/run without touching any component.
 */

const TOKEN_POOL = [4, 9, 2, 8, 5, 3, 14, 1, 6, 12, 11, 15, 13, 10, 16, 17, 18, 19, 20];

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function hashSlot(token: number, step: number, slotsK: number): number {
  return Math.abs((token * 3 + step) % slotsK);
}

/** Deterministically generate the input token sequence for a config. */
export function generateTokens(config: ExperimentConfig): number[] {
  const tokens: number[] = [];
  let rng = config.seed;
  for (let i = 0; i < config.seqLen; i++) {
    if (i === config.targetPos) {
      tokens.push(config.targetVal);
      continue;
    }
    const randIdx = Math.floor(seededRandom(rng++) * TOKEN_POOL.length);
    let val = TOKEN_POOL[randIdx];
    if (val === config.targetVal) val = (val + 1) % 21;
    tokens.push(val);
  }
  return tokens;
}

function cloneSlots(slots: MemorySlot[]): MemorySlot[] {
  return slots.map((s) => ({ ...s }));
}

/**
 * Run the full recurrent-memory experiment and return the entire trace
 * (one frame per step, plus the initial frame at step 0). Playback UI
 * simply indexes into this array - it never recomputes anything.
 */
export function buildTrace(config: ExperimentConfig, tokens: number[]): MemoryTraceStep[] {
  const slots: MemorySlot[] = Array.from({ length: config.slotsK }, (_, k) => ({
    id: k,
    val: 0,
    lastToken: null,
    holdsTarget: false,
    targetSignal: 0,
    collisionCount: 0,
  }));

  const trace: MemoryTraceStep[] = [];
  let collisions: MemoryTraceStep['collisions'] = [];

  trace.push({
    step: 0,
    slots: cloneSlots(slots),
    collisions: [],
    activeSlot: null,
    hadCollision: false,
    eventText: 'Trace initiated. Ready to feed tokens sequentially into recurrent state registers.',
  });

  for (let t = 0; t < tokens.length; t++) {
    const token = tokens[t];
    const isTarget = t === config.targetPos;
    const slotIdx = hashSlot(token, t, config.slotsK);
    const slot = slots[slotIdx];

    let hadCollision = false;
    let eventText = '';

    if (slot.holdsTarget && !isTarget) {
      hadCollision = true;
      slot.collisionCount++;
      slot.targetSignal = Math.max(0, slot.targetSignal * (1 - config.interference));
      eventText = `COLLISION in Slot ${slotIdx}: Token [${token}] overwrote slot previously holding Target [${config.targetVal}\u2605]'s signal! (Signal: ${(slot.targetSignal * 100).toFixed(0)}%)`;
      collisions = [...collisions, { step: t, slot: slotIdx, token }];
    } else if (slot.lastToken !== null && slot.lastToken !== token) {
      hadCollision = true;
      slot.collisionCount++;
      eventText = `COLLISION in Slot ${slotIdx}: Token [${token}] overwrote Token [${slot.lastToken}].`;
      collisions = [...collisions, { step: t, slot: slotIdx, token }];
    } else {
      eventText = `Token [${token}${isTarget ? '\u2605' : ''}] successfully routed to Slot ${slotIdx}.`;
    }

    slot.lastToken = token;
    slot.val = slot.val * (1 - config.interference) + token;
    if (isTarget) {
      slot.holdsTarget = true;
      slot.targetSignal = 1.0;
    }

    trace.push({
      step: t + 1,
      slots: cloneSlots(slots),
      collisions,
      activeSlot: slotIdx,
      hadCollision,
      eventText,
    });
  }

  return trace;
}

/** Evaluate ground-truth vs. decoded recall once the trace has completed. */
export function evaluateRecall(config: ExperimentConfig, finalFrame: MemoryTraceStep): ExperimentPrediction {
  const targetSlot = finalFrame.slots.find((s) => s.holdsTarget) ?? null;

  let confidence = 0.05;
  let decodedToken: number | null = null;
  let status: ExperimentPrediction['status'] = 'failure';

  if (targetSlot) {
    confidence = targetSlot.targetSignal;
    if (targetSlot.lastToken === config.targetVal && confidence > 0.65) {
      status = 'success';
      decodedToken = config.targetVal;
    } else if (confidence > 0.25) {
      status = 'degraded';
      decodedToken = config.targetVal;
    } else {
      decodedToken = targetSlot.lastToken;
    }
  }

  return {
    groundTruthToken: config.targetVal,
    groundTruthPos: config.targetPos,
    decodedToken,
    confidence,
    status,
  };
}

export function computeMetrics(config: ExperimentConfig, finalFrame: MemoryTraceStep, prediction: ExperimentPrediction): ExperimentMetrics {
  const usedSlots = finalFrame.slots.filter((s) => s.lastToken !== null).length;
  return {
    totalCollisions: finalFrame.collisions.length,
    capacityPressure: config.seqLen / config.slotsK,
    slotUtilizationPct: (usedSlots / config.slotsK) * 100,
    targetRetention: prediction.confidence,
  };
}

/** Convenience explanation string mirroring the original prototype's copy. */
export function describeOutcome(config: ExperimentConfig, finalFrame: MemoryTraceStep, prediction: ExperimentPrediction): string {
  const pressureRatio = (config.seqLen / config.slotsK).toFixed(1);
  const targetSlot = finalFrame.slots.find((s) => s.holdsTarget);

  if (prediction.status === 'success') {
    return `In this experiment, the memory contains ${config.slotsK} slots while the sequence produced ${config.seqLen} updates (pressure ratio: ${pressureRatio}\u00d7). Because capacity pressure was sufficiently low and the interference factor was calibrated (\u03c4 = ${config.interference.toFixed(2)}), the target signal [${config.targetVal}\u2605] survived to query time with ${Math.round(prediction.confidence * 100)}% SNR.`;
  }
  if (prediction.status === 'degraded') {
    return `In this experiment, capacity pressure escalated to ${pressureRatio}\u00d7. Multiple later tokens collided in Slot ${targetSlot ? targetSlot.id : 'N'}, eroding the target's residual scalar energy. While decoded, confidence dropped to ${prediction.confidence.toFixed(2)}, demonstrating partial catastrophic interference.`;
  }
  return `Why did recall fail? The memory allocated only ${config.slotsK} slots for ${config.seqLen} discrete tokens (${pressureRatio}\u00d7 overload). Total collisions reached ${finalFrame.collisions.length}. The target's signal was completely purged or overwritten by competing inputs before the query probe arrived.`;
}
