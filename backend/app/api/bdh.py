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
                "Reference topic only. Exact architecture details are pending "
                "source verification."
            ),
            relation_to_topic=(
                "Used as external context for learners studying recurrent "
                "memory ideas. Not implemented by this backend."
            ),
            not_implemented_by_toy_engine=True,
            sources=[
                "TODO: verify primary BDH paper reference before final submission",
            ],
        ),
        BDHEntry(
            name="BDH-CQ",
            type="research_reference",
            role=(
                "Reference topic only. Exact architecture details are pending "
                "source verification."
            ),
            relation_to_topic=(
                "Used as external context for learners studying recurrent "
                "memory ideas. Not implemented by this backend."
            ),
            not_implemented_by_toy_engine=True,
            sources=[
                "TODO: verify primary BDH-CQ paper reference before final submission",
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
