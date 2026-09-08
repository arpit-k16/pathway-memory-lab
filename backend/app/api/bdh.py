"""BDH / BDH-CQ research reference endpoint.

IMPORTANT: Our toy recurrent memory engine is NOT an implementation of BDH
or BDH-CQ.  This module provides *reference information only* so the
frontend can later build a teaching section connecting the toy model to
real research.

No equations, benchmark numbers, or architecture details are invented.
Placeholders are marked TODO.
"""

from fastapi import APIRouter

from ..schemas import BDHEntry, BDHResponse

router = APIRouter(tags=["research"])

_BDH_RESPONSE = BDHResponse(
    implementation_status="reference_only",
    not_implemented_by_toy_engine=True,
    disclaimer=(
        "The educational toy memory engine in this application is NOT an "
        "implementation of BDH or BDH-CQ.  It uses a simple additive-"
        "superposition mechanism for pedagogical clarity.  The entries "
        "below are research references only."
    ),
    entries=[
        BDHEntry(
            name="BDH",
            type="research_reference",
            role=(
                "Primary-source context: a scale-free, locally interacting neuron-particle architecture; its inference-time working memory relies on synaptic plasticity."
            ),
            relation_to_topic=(
                "Used as external context for learners studying recurrent "
                "memory ideas. Not implemented by this backend."
            ),
            not_implemented_by_toy_engine=True,
            sources=[
                "arXiv:2509.26507 — https://arxiv.org/abs/2509.26507",
            ],
        ),
        BDHEntry(
            name="BDH-CQ",
            type="research_reference",
            role=(
                "Primary-source context: inputs update recurrent memory and a query is solved through iterative high-dimensional latent computation."
            ),
            relation_to_topic=(
                "Used as external context for learners studying recurrent "
                "memory ideas. Not implemented by this backend."
            ),
            not_implemented_by_toy_engine=True,
            sources=[
                "arXiv:2608.09888 — https://arxiv.org/abs/2608.09888",
            ],
        ),
    ],
)


@router.get("/bdh", response_model=BDHResponse)
def get_bdh_reference() -> BDHResponse:
    """Return BDH / BDH-CQ research reference information.

    This endpoint explicitly separates our toy engine from BDH.
    """
    return _BDH_RESPONSE
