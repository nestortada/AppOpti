"""Stub endpoint for optimization requests."""

from __future__ import annotations

from fastapi import APIRouter

from ..models import OptimizationRequest

router = APIRouter(prefix="/api/v1/optimization", tags=["optimization"])


@router.post("")
def optimize(payload: OptimizationRequest) -> dict:
    """Pretend to run an optimization job."""

    # In a real implementation this would trigger background processing.
    return {"status": "queued", "file_id": str(payload.file_id), "min_days": payload.min_days}
