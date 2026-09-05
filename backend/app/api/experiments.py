"""Experiment endpoints: run, retrieve, sweep, and preset execution."""

from fastapi import APIRouter, HTTPException

from ..schemas import (
    ExperimentRequest,
    ExperimentResponse,
    SweepRequest,
    SweepResponse,
    SweepResultItem,
)
from ..core.experiment import get_experiment, run_experiment, run_sweep
from .presets import PRESETS

router = APIRouter(tags=["experiments"])


@router.post("/experiments", response_model=ExperimentResponse)
def create_experiment(req: ExperimentRequest) -> dict:
    """Run a single experiment and return the full result."""
    return run_experiment(
        sequence_length=req.sequence_length,
        memory_slots=req.memory_slots,
        vocabulary_size=req.vocabulary_size,
        target_token=req.target_token,
        interference=req.interference,
        seed=req.seed,
        target_position=req.target_position,
        query_position=req.query_position,
    )


@router.get("/experiments/{experiment_id}", response_model=ExperimentResponse)
def retrieve_experiment(experiment_id: str) -> dict:
    """Retrieve a previously run experiment by ID."""
    result = get_experiment(experiment_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Experiment not found.")
    return result


@router.post("/experiments/sweep", response_model=SweepResponse)
def sweep_experiments(req: SweepRequest) -> dict:
    """Run a parameter sweep and return summary results."""
    valid_params = {"sequence_length", "memory_slots", "interference"}
    if req.sweep_parameter not in valid_params:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid sweep_parameter '{req.sweep_parameter}'. Must be one of {sorted(valid_params)}.",
        )
    try:
        items = run_sweep(
            sweep_parameter=req.sweep_parameter,
            sweep_values=req.sweep_values,
            base_sequence_length=req.base_sequence_length,
            base_memory_slots=req.base_memory_slots,
            base_vocabulary_size=req.base_vocabulary_size,
            base_target_token=req.base_target_token,
            base_interference=req.base_interference,
            seed=req.seed,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    return {"sweep_parameter": req.sweep_parameter, "results": items}


@router.post("/experiments/preset/{preset_name}", response_model=ExperimentResponse)
def run_preset(preset_name: str) -> dict:
    """Run a named preset experiment."""
    preset = PRESETS.get(preset_name)
    if preset is None:
        raise HTTPException(
            status_code=404,
            detail=f"Unknown preset '{preset_name}'. Available: {sorted(PRESETS.keys())}",
        )
    params = preset["parameters"]
    return run_experiment(**params)
