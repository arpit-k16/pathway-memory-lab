"""FastAPI application entry point.

Creates the app, attaches CORS middleware, and includes all routers.
Run with:  uvicorn app.main:app --reload
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .api import health, concepts, experiments, presets, bdh
from .data import research

app = FastAPI(
    title="Memory Lab Backend",
    version=settings.VERSION,
    description=(
        "Educational backend demonstrating in-context learning with "
        "recurrent memory.  A fixed-size state is updated sequentially "
        "and queried for recall."
    ),
)

# -- CORS --
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -- Routers --
app.include_router(health.router)
app.include_router(concepts.router, prefix="/api/v1")
app.include_router(experiments.router, prefix="/api/v1")
app.include_router(presets.router, prefix="/api/v1")
app.include_router(bdh.router, prefix="/api/v1")
app.include_router(research.router, prefix="/api/v1")
