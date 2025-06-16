"""APScheduler configuration for periodic cleanup."""

from __future__ import annotations

from datetime import datetime, timedelta
from pathlib import Path
import logging

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

from .utils import storage

LOG_PATH = Path("/var/log/opt-puestos/cleanup.log")
LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
logging.basicConfig(filename=str(LOG_PATH), level=logging.INFO)

scheduler = BackgroundScheduler(timezone="UTC")


def cleanup_job() -> None:
    """Remove files and jobs older than 24 hours."""

    threshold = datetime.utcnow() - timedelta(hours=24)
    storage.cleanup_older_than(threshold)
    logging.info("Cleanup run at %s", datetime.utcnow().isoformat())


scheduler.add_job(cleanup_job, CronTrigger(hour=3, minute=0))
