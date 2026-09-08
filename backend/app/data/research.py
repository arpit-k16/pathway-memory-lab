"""Research metadata endpoint and data structures.

Candidate research areas are listed but NO citations are invented.
Unverified entries are marked TODO.
"""

from fastapi import APIRouter

from ..schemas import ResearchSource

router = APIRouter(tags=["research"])

_SOURCES: list[ResearchSource] = [
    ResearchSource(title="The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain", authors=["Adrian Kosowski", "Przemysław Uznański", "Jan Chorowski", "Zuzanna Stamirowska", "Michał Bartoszkiewicz"], year=2025, identifier="arXiv:2509.26507", url="https://arxiv.org/abs/2509.26507", source_type="primary_source", claim_supported="BDH is a recurrent language-model architecture whose inference-time working memory relies on synaptic plasticity.", notes="Primary source; used here only for conceptual context, not as a benchmark reproduced by this toy."),
    ResearchSource(
        title="BDH-CQ: In-Context Learning with Recurrent Latent Reasoning", authors=["Björn Engdahl", "Adrian Kosowski", "Jan Chorowski", "Zuzanna Stamirowska", "Przemysław Uznański", "Junlin Jiang", "Rohan Phadke", "Remigiusz Kinas", "Richard Zhong"], year=2026, identifier="arXiv:2608.09888", url="https://arxiv.org/abs/2608.09888", source_type="primary_source", claim_supported="BDH-CQ describes inference-time inputs updating recurrent memory followed by iterative latent computation for a query.", notes="Primary source; substantially beyond this toy engine's scalar-slot update and readout.",
    ),
    ResearchSource(
        title="Titans: Learning to Memorize at Test Time", authors=["Ali Behrouz", "Peilin Zhong", "Vahab Mirrokni"], year=2025, identifier="arXiv:2501.00663", url="https://arxiv.org/abs/2501.00663", source_type="primary_source", claim_supported="A recent primary source contrasting recurrent hidden-state compression, attention, and learned long-term memory.", notes="Contextual comparison only; no Titans result is generated or claimed by Memory Lab.",
    ),
    ResearchSource(
        title="Griffin: Mixing Gated Linear Recurrences with Local Attention for Efficient Language Models", authors=["Soham De et al."], year=2024, identifier="arXiv:2402.19427", url="https://arxiv.org/abs/2402.19427", source_type="primary_source", claim_supported="A primary source on mixing gated linear recurrences with local attention for efficient language modeling.", notes="Contextual comparison only; this toy is not Griffin or a reproduction of its results.",
    ),
]


@router.get("/research", response_model=list[ResearchSource])
def get_research_sources() -> list[ResearchSource]:
    """Return research metadata (placeholder entries marked TODO)."""
    return _SOURCES
