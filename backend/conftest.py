"""Shared pytest fixtures."""

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.core.experiment import clear_experiments


@pytest.fixture()
def client():
    """Fresh TestClient; clears experiment registry between tests."""
    clear_experiments()
    with TestClient(app) as c:
        yield c
