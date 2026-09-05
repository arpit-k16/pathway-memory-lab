"""Concept metadata endpoint."""

from fastapi import APIRouter

from ..schemas import ConceptResponse

router = APIRouter(tags=["concept"])

_CONCEPT = ConceptResponse(
    title="In-Context Learning with Recurrent Memory",
    approved_topic="IN-CONTEXT LEARNING WITH RECURRENT MEMORY",
    central_claim=(
        "A fixed-size recurrent state can carry useful information across "
        "increasingly long sequences without allocating a new memory slot "
        "for every token, but as sequence length and interference increase "
        "relative to memory capacity, recall can degrade."
    ),
    intended_learner=(
        "A technically curious learner (undergraduate CS/ML level or "
        "motivated self-learner) who wants to understand how recurrent "
        "memory works and why capacity limits matter."
    ),
    prerequisites=[
        "Basic understanding of sequences and arrays",
        "Familiarity with the idea of a hash function (helpful but not required)",
        "No deep-learning experience needed",
    ],
    learning_objectives=[
        "Understand what a fixed-size recurrent state is",
        "See how sequential information is written to bounded memory",
        "Observe how collisions and interference degrade recall",
        "Explore the trade-off between sequence length and memory capacity",
        "Connect the toy demonstration to research concepts (BDH, BDH-CQ)",
    ],
    limitations=[
        "This is a toy model — not a neural network",
        "The memory engine uses simple modular hashing, not learned attention",
        "Results do not generalize directly to production language models",
        "Metrics are specific to this toy system",
    ],
    terminology={
        "memory_slots": "The fixed number of scalar slots in the state vector (K).",
        "token": "A discrete symbol from the vocabulary.",
        "signature": "A deterministic scalar value derived from a token.",
        "superposition": "Adding multiple signatures into the same slot.",
        "collision": "When two or more tokens map to the same memory slot.",
        "interference": "Additional noise applied during state updates.",
        "capacity_pressure": "The ratio sequence_length / memory_slots.",
        "recall": "Successfully recovering a target token's information from state.",
    },
)


@router.get("/concept", response_model=ConceptResponse)
def get_concept() -> ConceptResponse:
    return _CONCEPT
