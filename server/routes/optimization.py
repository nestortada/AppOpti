"""Stub endpoint for optimization requests."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from ..models import OptimizationRequest
from ..utils.optimizer import launch_job, get_status
from ..utils import storage

router = APIRouter(prefix="/api/v1/optimization", tags=["optimization"])


@router.post("")
def optimize(payload: OptimizationRequest) -> dict:
    """Launch a background optimization job."""

    if payload.file_id not in storage.FILES:
        raise HTTPException(status_code=404, detail="file not found")
    job_id = launch_job(payload.file_id, payload.min_days)
    return {"job_id": job_id}


@router.get("/{job_id}/status")
def job_status(job_id: str) -> dict:
    job = get_status(job_id)
    resp = {"state": job.status}
    if job.status == "success":
        resp.update(job.result["kpis"])
    if job.error:
        resp["error"] = job.error
    return resp


@router.get("/{job_id}/log")
def job_log(job_id: str) -> dict:
    job = get_status(job_id)
    return {"log": job.log}
