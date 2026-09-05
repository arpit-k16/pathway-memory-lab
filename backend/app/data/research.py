"""Research metadata endpoint and data structures.

Candidate research areas are listed but NO citations are invented.
Unverified entries are marked TODO.
"""

from fastapi import APIRouter

from ..schemas import ResearchSource

router = APIRouter(tags=["research"])

_SOURCES: list[ResearchSource] = [
    ResearchSource(
        title="TODO: verify primary paper on recurrent language models",
        authors=[],
        year=None,
        identifier=None,
        url=None,
        source_type="primary_paper",
        claim_supported=(
            "Fixed-size recurrent states can carry information across "
            "long sequences but face capacity limits."
        ),
        notes="TODO: verify primary source before final submission.",
    ),
    ResearchSource(
        title="TODO: verify primary paper on recall/memory trade-offs in linear attention",
        authors=[],
        year=None,
        identifier=None,
        url=None,
        source_type="primary_paper",
        claim_supported=(
            "As sequence length increases relative to state size, "
            "recall quality degrades due to representational interference."
        ),
        notes="TODO: verify primary source before final submission.",
    ),
    ResearchSource(
        title="TODO: verify BDH / Dragon Hatchling primary paper",
        authors=[],
        year=None,
        identifier=None,
        url=None,
        source_type="primary_paper",
        claim_supported=(
            "Recurrent architectures with fixed-size latent states can "
            "approach transformer-level performance on certain tasks."
        ),
        notes="TODO: verify primary source before final submission.",
    ),
]


@router.get("/research", response_model=list[ResearchSource])
def get_research_sources() -> list[ResearchSource]:
    """Return research metadata (placeholder entries marked TODO)."""
    return _SOURCES
