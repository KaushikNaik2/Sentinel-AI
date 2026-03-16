"""
Sentinel-AI — Score Routes
Security score summary endpoint.
"""

from fastapi import APIRouter
import logging
from app.services.score_engine import score_engine
from app.services.system_monitor import monitor
from app.services.anomaly_detector import anomaly_detector

logger = logging.getLogger("sentinel-ai.routes.score")

router = APIRouter()


@router.get("/")
async def get_score():
    """Get current overall security score based on system state."""
    try:
        connections = monitor.get_network_connections()
        processes = monitor.get_processes()

        bad_conns = sum(1 for c in connections if c.get("is_bad"))
        flagged = sum(1 for p in processes if p.get("risk") == "HIGH_RISK")

        return score_engine.calculate(
            breaches=[],
            anomaly_count=anomaly_detector.anomaly_count,
            flagged_processes=flagged,
            bad_connections=bad_conns,
        )
    except Exception as e:
        logger.error("Score calculation error: %s", e)
        return {
            "score": 100,
            "grade": "A",
            "label": "Good",
            "breakdown": {
                "breaches": 0,
                "anomalies": 0,
                "processes": 0,
                "network": 0,
            }
        }
