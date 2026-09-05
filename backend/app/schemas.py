"""Pydantic v2 request / response schemas."""

from __future__ import annotations

from typing import Any, List, Literal, Optional, Union

from pydantic import BaseModel, Field, model_validator


# ---------------------------------------------------------------------------
# Requests
# ---------------------------------------------------------------------------

class ExperimentRequest(BaseModel):
    """Parameters for a single experiment run."""

    sequence_length: int = Field(
        ..., ge=4, le=500,
        description="Number of tokens in the input sequence (4–500).",
    )
    memory_slots: int = Field(
        ..., ge=2, le=128,
        description="Number of fixed memory slots K (2–128).",
    )
    vocabulary_size: int = Field(
        ..., ge=2, le=1000,
        description="Token vocabulary size — tokens are in [0, vocab) (2–1000).",
    )
    target_token: int = Field(
        ..., ge=0,
        description="The token whose recall will be tested.",
    )
    interference: float = Field(
        0.0, ge=0.0, le=1.0,
        description="Noise magnitude added to each state update (0–1).",
    )
    seed: int = Field(
        42,
        description="Random seed for reproducibility.",
    )
    target_position: Optional[int] = Field(
        None,
        description="Optional fixed position where the target token is introduced.",
    )
    query_position: Optional[int] = Field(
        None,
        description=(
            "Position at which recall is queried. Null means query after the final update."
        ),
    )

    @model_validator(mode="after")
    def validate_positions(self) -> "ExperimentRequest":
        if self.target_token >= self.vocabulary_size:
            raise ValueError(
                f"target_token ({self.target_token}) must be < vocabulary_size ({self.vocabulary_size})."
            )
        if self.target_position is not None and not (0 <= self.target_position < self.sequence_length):
            raise ValueError(
                f"target_position ({self.target_position}) must be in [0, {self.sequence_length})."
            )
        if self.query_position is not None and not (0 <= self.query_position < self.sequence_length):
            raise ValueError(
                f"query_position ({self.query_position}) must be in [0, {self.sequence_length})."
            )
        return self


class SweepRequest(BaseModel):
    """Parameters for a parameter-sweep experiment."""

    sweep_parameter: str = Field(
        ...,
        description="Which parameter to sweep: 'sequence_length', 'memory_slots', or 'interference'.",
    )
    sweep_values: List[Union[int, float]] = Field(
        ...,
        description="List of values to sweep over.",
    )
    base_sequence_length: int = Field(32, ge=4, le=500)
    base_memory_slots: int = Field(8, ge=2, le=128)
    base_vocabulary_size: int = Field(20, ge=2, le=1000)
    base_target_token: int = Field(7, ge=0)
    base_interference: float = Field(0.0, ge=0.0, le=1.0)
    seed: int = Field(42)


# ---------------------------------------------------------------------------
# Responses
# ---------------------------------------------------------------------------

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str


class GroundTruth(BaseModel):
    target_token: int
    target_position: int
    present_in_sequence: bool
    target_occurrences: int
    query_position: int
    target_seen_before_query: bool


class Prediction(BaseModel):
    query_position: int
    target_token: int
    target_slot: int
    expected_signature: float
    actual_slot_value: float
    slot_write_count: int
    confidence: float
    predicted_token: Optional[int]
    recall_status: Literal["success", "degraded", "failure", "inconclusive"]
    recovered: bool


class ClaimTestResult(BaseModel):
    outcome: Literal["recall_success", "recall_degraded", "inconclusive"]
    evidence: str
    scope: str


class Explanation(BaseModel):
    mechanism: str
    observation: str
    limitation: str
    claim_test_result: ClaimTestResult


class ExperimentParameters(BaseModel):
    sequence_length: int
    memory_slots: int
    vocabulary_size: int
    target_token: int
    interference: float
    target_position: Optional[int]
    query_position: Optional[int]


class MetricsResponse(BaseModel):
    correct: bool
    accuracy: float
    target_signal: float
    prediction_confidence: float
    memory_utilization: float
    active_slots: int
    collision_count: int
    collision_rate: float
    state_norm: float
    capacity_pressure: float
    slot_write_counts: List[int]


class TraceItem(BaseModel):
    position: int
    token: int
    updated_slot: int
    slot_before: float
    slot_after: float
    state: List[float]
    state_norm: float
    collision: bool
    collision_count: int
    active_slots: int
    target_signal: Optional[float] = None
    target_present: Optional[bool] = None


class ExperimentResponse(BaseModel):
    experiment_id: str
    seed: int
    parameters: ExperimentParameters
    sequence: List[int]
    target_token: int
    ground_truth: GroundTruth
    prediction: Prediction
    correct: bool
    metrics: MetricsResponse
    memory_trace: List[TraceItem]
    final_state: List[float]
    explanation: Explanation


class SweepResultItem(BaseModel):
    parameter: Union[int, float]
    experiment_id: str
    correct: bool
    accuracy: float
    collision_rate: float
    memory_utilization: float
    target_signal: float
    capacity_pressure: float


class SweepResponse(BaseModel):
    sweep_parameter: str
    results: List[SweepResultItem]


class PresetInfo(BaseModel):
    name: str = Field(description="Preset identifier.")
    parameters: ExperimentRequest
    purpose: str = Field(description="Educational purpose of this preset.")
    expected_phenomenon: str = Field(description="What the learner should investigate.")


class ConceptResponse(BaseModel):
    title: str
    approved_topic: str
    central_claim: str
    intended_learner: str
    prerequisites: List[str]
    learning_objectives: List[str]
    limitations: List[str]
    terminology: dict[str, str]


class ResearchSource(BaseModel):
    title: str
    authors: List[str]
    year: Optional[int]
    identifier: Optional[str]
    url: Optional[str]
    source_type: str
    claim_supported: Optional[str]
    notes: str


class BDHEntry(BaseModel):
    name: str
    type: str
    role: str
    relation_to_topic: str
    not_implemented_by_toy_engine: bool
    sources: List[str]


class BDHResponse(BaseModel):
    implementation_status: Literal["reference_only"]
    not_implemented_by_toy_engine: bool
    disclaimer: str
    entries: List[BDHEntry]
