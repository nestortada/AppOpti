from __future__ import annotations

import uuid
import threading
import logging
from dataclasses import dataclass
from typing import Dict, Any

from firebase_admin import firestore

from . import storage
from .solver import run_optimization
from .firebase_config import setup_firebase_credentials

# Initialize Firestore client
firebase_app = setup_firebase_credentials()
db = None
if firebase_app:
    db = firestore.client(firebase_app)
else:
    logging.warning("Firebase initialization failed. Some features may be unavailable.")

@dataclass
class JobRecord:
    file_id: uuid.UUID
    min_days: int
    status: str = "queued"
    result: Dict[str, Any] | None = None
    error: str | None = None
    log: str = ""

JOBS: Dict[str, JobRecord] = {}


def _run(job_id: str, file_id: uuid.UUID, min_days: int) -> None:
    job = JOBS[job_id]
    job.status = "running"
    try:
        data = storage.load_json(file_id)
        result = run_optimization(data, min_days)
        job.result = result
        job.status = "success"
        if db:
            # Convert data types for Firebase compatibility
            doc = {
                "status": "success",
                "assignments": result["assignments"],
                "group_zones_table": result["group_zones_table"],
                "kpis": result["kpis"],
                "timestamp": firestore.SERVER_TIMESTAMP,
                "minAttendance": min_days,
                "file_id": str(file_id),
                # New metrics
                "employees_g": {str(k): str(v) for k, v in result["employees_g"].items()},
                "meeting_days": {str(k): str(v) for k, v in result["meeting_days"].items()},
                "different_desks": result["different_desks"],
                "lonely_members": [
                    {"group": str(g), "employee": str(e), "day": str(d), "zone": str(z)}
                    for g, e, d, z in result["lonely_members"]
                ],
                "violated_preferences": [
                    {"employee": str(e), "day": str(d), "preferences": str(p) if not isinstance(p, (list, tuple)) else ', '.join(map(str, p))}
                    for e, d, p in result["violated_preferences"]
                ],
                "unused_desks": [
                    {"desk": str(desk), "day": str(day), "obs": str(obs)}
                    for desk, day, obs in result["unused_desks"]
                ]
            }
            db.collection("optimizations").document(job_id).set(doc)
    except Exception as exc:
        job.status = "failure"
        job.error = str(exc)
        if db:
            doc = {
                "status": "failure",
                "reason": str(exc),
                "timestamp": firestore.SERVER_TIMESTAMP,
                "minAttendance": min_days,
                "file_id": str(file_id),
            }
            db.collection("optimizations").document(job_id).set(doc)


def launch_job(file_id: uuid.UUID, min_days: int) -> str:
    job_id = str(uuid.uuid4())
    JOBS[job_id] = JobRecord(file_id=file_id, min_days=min_days)
    thread = threading.Thread(target=_run, args=(job_id, file_id, min_days), daemon=True)
    thread.start()
    record = storage.FILES[file_id]
    record.job_id = job_id
    storage.FILES[file_id] = record
    return job_id

def get_status(job_id: str) -> JobRecord:
    return JOBS[job_id]

