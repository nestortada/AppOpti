"""Pydantic models for API requests and responses.

This module defines all data schemas used by the FastAPI application. The
models make validation explicit and provide type hints across the codebase.
"""

from __future__ import annotations

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field
from typing import Dict, List, Any


class Summary(BaseModel):
    """Summarized counts of entities in the uploaded JSON file."""

    employees: int
    desks: int
    days: int
    groups: int
    zones: int


class FileResponse(BaseModel):
    """Response returned after successfully uploading a JSON file."""

    id: UUID
    summary: Summary
    sample: Dict[str, Any]


class LintMessage(BaseModel):
    """Single lint message produced by validation."""

    severity: str
    msg: str


class LintResult(BaseModel):
    """Collection of lint messages for a file."""

    errors: List[LintMessage]


class OptimizationRequest(BaseModel):
    """Payload for the optimization endpoint."""

    file_id: UUID = Field(alias="file_id")
    min_days: int


class FileRecord(BaseModel):
    """Internal representation of a stored file."""

    id: UUID
    path: str
    created_at: datetime
    updated_at: datetime
    job_id: str | None = None
