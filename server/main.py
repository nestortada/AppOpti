"""Main entry point for the FastAPI application."""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv


load_dotenv()

from routes import files, optimization
from scheduler import scheduler
from utils.firebase_config import setup_firebase_credentials


setup_firebase_credentials()

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
