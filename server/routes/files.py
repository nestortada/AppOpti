"""Routes for handling JSON file uploads and linting."""

from __future__ import annotations

import json
from tempfile import SpooledTemporaryFile
from typing import Any, Dict, List
from uuid import UUID

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

from ..models import FileResponse, Summary, LintResult, LintMessage
from ..utils import storage

router = APIRouter(prefix="/api/v1/files", tags=["files"])

REQUIRED_KEYS = [
    "Employees",
    "Desks",
    "Days",
    "Groups",
    "Zones",
    "Desks_Z",
    "Desks_E",
    "Employees_G",
    "Days_E",
]


@router.post("", response_model=FileResponse)
async def upload_file(file: UploadFile = File(...)) -> FileResponse:
    """Validate and persist a JSON file."""

    if file.content_type != "application/json":
        raise HTTPException(status_code=422, detail="Invalid content type")
    spooled = SpooledTemporaryFile(max_size=10 * 1024 * 1024)
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=422, detail="File too large")
    spooled.write(content)
    spooled.seek(0)
    try:
        data = json.load(spooled)
    except json.JSONDecodeError:
        raise HTTPException(status_code=422, detail="Invalid JSON")

    errors: List[Dict[str, str]] = []
    for key in REQUIRED_KEYS:
        if key not in data:
            errors.append({"path": key, "msg": "key missing"})
    if errors:
        return JSONResponse(status_code=422, content={"errors": errors})

    record = storage.save_file(data)
    summary = Summary(
        employees=len(data.get("Employees", [])),
        desks=len(data.get("Desks", [])),
        days=len(data.get("Days", [])),
        groups=len(data.get("Groups", {})),
        zones=len(data.get("Zones", [])),
    )
    sample = {k: data[k][:3] if isinstance(data[k], list) else data[k] for k in REQUIRED_KEYS if k in data}
    return FileResponse(id=record.id, summary=summary, sample=sample)


@router.get("/{file_id}/lint", response_model=LintResult)
def lint_file(file_id: UUID) -> LintResult:
    """Perform lint checks on a stored file."""

    data = storage.load_json(file_id)
    errors: List[LintMessage] = []
    for employee in data.get("Employees", []):
        groups = data.get("Employees_G", {})
        if employee not in groups.get(next(iter(groups), ""), []):
            errors.append(LintMessage(severity="error", msg=f"Empleado {employee} sin grupo"))
    # simple example check
    return LintResult(errors=errors)
