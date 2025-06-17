"""Tests for the file upload and lint endpoints."""

from __future__ import annotations

import json
from fastapi.testclient import TestClient
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[2]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from server.main import app

client = TestClient(app)

SAMPLE = {
    "Employees": ["E0", "E1", "E2"],
    "Desks": ["D0", "D1"],
    "Days": ["L", "M", "X", "J", "V"],
    "Groups": {"G1": ["E0", "E1"]},
    "Zones": ["Z1", "Z2"],
    "Desks_Z": {"Z1": ["D0"], "Z2": ["D1"]},
    "Desks_E": {"E0": ["D0"], "E1": ["D1"]},
    "Employees_G": {"G1": ["E0", "E1"]},
    "Days_E": {"E0": ["L", "M"], "E1": ["M", "X"]},
}


def test_upload_ok() -> None:
    resp = client.post(
        "/api/v1/files",
        files={"file": ("test.json", json.dumps(SAMPLE), "application/json")},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["summary"]["employees"] == 3
    assert "id" in body


def test_upload_missing_key() -> None:
    bad = SAMPLE.copy()
    bad.pop("Employees")
    resp = client.post(
        "/api/v1/files",
        files={"file": ("test.json", json.dumps(bad), "application/json")},
    )
    assert resp.status_code == 422
    assert resp.json()["errors"][0]["path"] == "Employees"

def test_optimize_flow() -> None:
    resp = client.post(
        "/api/v1/files",
        files={"file": ("test.json", json.dumps(SAMPLE), "application/json")},
    )
    file_id = resp.json()["id"]
    resp = client.post("/api/v1/optimization", json={"file_id": file_id, "min_days": 1})
    assert resp.status_code == 200
    job_id = resp.json()["job_id"]
    status = client.get(f"/api/v1/optimization/{job_id}/status").json()
    assert "state" in status
