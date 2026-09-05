"""Tests for BDH / BDH-CQ endpoint — must be clearly separated from toy engine."""


def test_bdh_endpoint_returns_reference(client):
    resp = client.get("/api/v1/bdh")
    assert resp.status_code == 200
    data = resp.json()
    assert "disclaimer" in data
    assert "entries" in data
    assert data["implementation_status"] == "reference_only"
    assert data["not_implemented_by_toy_engine"] is True


def test_bdh_disclaimer_mentions_not_implemented(client):
    data = client.get("/api/v1/bdh").json()
    assert "NOT" in data["disclaimer"]


def test_bdh_entries_flag_not_implemented(client):
    data = client.get("/api/v1/bdh").json()
    for entry in data["entries"]:
        assert entry["not_implemented_by_toy_engine"] is True
        assert entry["type"] == "research_reference"


def test_concept_endpoint(client):
    resp = client.get("/api/v1/concept")
    assert resp.status_code == 200
    data = resp.json()
    assert "central_claim" in data
    assert "fixed-size" in data["central_claim"].lower()


def test_research_endpoint(client):
    resp = client.get("/api/v1/research")
    assert resp.status_code == 200
    sources = resp.json()
    assert isinstance(sources, list)
    assert len(sources) >= 1
    # All unverified sources should have TODO in notes
    for s in sources:
        assert "TODO" in s["notes"] or len(s["authors"]) > 0
