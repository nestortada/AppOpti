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
            doc = {
                "status": "success",
                "assignments": result["assignments"],
                "kpis": result["kpis"],
                "timestamp": firestore.SERVER_TIMESTAMP,
                "minAttendance": min_days,
                "file_id": str(file_id),
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

