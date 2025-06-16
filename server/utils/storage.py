"""Utility helpers for file storage and cleanup.

Files are stored in a temporary directory inside the repository. This module
handles creation, retrieval and deletion of those files and provides helpers
for the scheduled cleanup task.
"""

from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List
from uuid import uuid4, UUID

from ..models import FileRecord

STORAGE_DIR = Path("./uploads")
STORAGE_DIR.mkdir(exist_ok=True)

# Simple in-memory database mapping ids to FileRecord
FILES: Dict[UUID, FileRecord] = {}


def save_file(data: Dict[str, Any]) -> FileRecord:
    """Persist a JSON object to disk and return its record."""

    file_id = uuid4()
    path = STORAGE_DIR / f"{file_id}.json"
    with path.open("w", encoding="utf-8") as fh:
        json.dump(data, fh)
    now = datetime.utcnow()
    record = FileRecord(id=file_id, path=str(path), created_at=now, updated_at=now)
    FILES[file_id] = record
    return record


def load_json(file_id: UUID) -> Dict[str, Any]:
    """Return JSON content for a stored file."""

    record = FILES[file_id]
    with open(record.path, "r", encoding="utf-8") as fh:
        return json.load(fh)


def remove_record(file_id: UUID) -> None:
    """Delete a file and its record."""

    record = FILES.pop(file_id, None)
    if record:
        Path(record.path).unlink(missing_ok=True)


def cleanup_older_than(threshold: datetime) -> None:
    """Remove records older than the given threshold."""

    to_remove: List[UUID] = []
    for fid, record in FILES.items():
        if record.created_at < threshold and record.job_id is None:
            to_remove.append(fid)
    for fid in to_remove:
        remove_record(fid)
