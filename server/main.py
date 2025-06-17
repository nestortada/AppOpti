"""Main entry point for the FastAPI application."""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# When executed directly, __package__ is not set and relative imports fail.
# Adjust sys.path so we can import the modules as part of the ``server`` package.
import sys
from pathlib import Path

if __package__ is None or __package__ == "":
    sys.path.append(str(Path(__file__).resolve().parent))
    from server.routes import files, optimization
    from server.scheduler import scheduler
else:
    from .routes import files, optimization
    from .scheduler import scheduler

app = FastAPI(title="Opt Puestos API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(files.router)
app.include_router(optimization.router)


@app.on_event("startup")
def start_scheduler() -> None:
    if not scheduler.running:
        scheduler.start()


@app.on_event("shutdown")
def shutdown_scheduler() -> None:
    if scheduler.running:
        scheduler.shutdown()
