"""APScheduler configuration for periodic cleanup."""

from __future__ import annotations

from datetime import datetime, timedelta
from pathlib import Path
import logging

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

from .utils import storage

# Configure simple logging
logging.basicConfig(level=logging.INFO)

# In serverless environments like Vercel, we don't need background tasks
# as the instance is ephemeral
scheduler = BackgroundScheduler(timezone="UTC")
