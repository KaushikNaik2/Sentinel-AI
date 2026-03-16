"""
Sentinel-AI — Breach Routes
Endpoints for email breach checking and security score.
"""

from fastapi import APIRouter, HTTPException
import logging
from app.models.breach import BreachCheckRequest, BreachCheckResponse
from app.services.hibp import hibp
from app.services.score_engine import score_engine
from app.services.system_monitor import monitor

logger = logging.getLogger("sentinel-ai.routes.breach")

router = APIRouter()


@router.post("/check", response_model=BreachCheckResponse)
async def check_breach(req: BreachCheckRequest):
    """Check email address against HaveIBeenPwned breach database."""
    try:
        breaches = await hibp.check_email(req.email)

        # Calculate score impact (monitor calls may need elevated permissions)
        bad_conns = 0
        flagged = 0
        try:
            connections = monitor.get_network_connections()
            processes = monitor.get_processes()
            bad_conns = sum(1 for c in connections if c.get("is_bad"))
            flagged = sum(1 for p in processes if p.get("risk") == "HIGH_RISK")
        except Exception as monitor_err:
            logger.warning("Monitor data unavailable: %s", monitor_err)

        score_data = score_engine.calculate(
            breaches=breaches,
            anomaly_count=0,
            flagged_processes=flagged,
            bad_connections=bad_conns,
        )

        return BreachCheckResponse(
            breaches=breaches,
            total_breaches=len(breaches),
            score_impact=100 - score_data["score"],
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Breach check error: %s", e)
        raise HTTPException(status_code=500, detail="Breach check failed. Please try again.")


@router.get("/score")
async def get_breach_score(email: str):
    """Get security score for an email address."""
    # Validate email format
    import re
    email = email.strip().lower()
    if not re.match(r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$", email):
        raise HTTPException(status_code=400, detail="Invalid email address format")

    try:
        breaches = await hibp.check_email(email)
        connections = monitor.get_network_connections()
        processes = monitor.get_processes()
        bad_conns = sum(1 for c in connections if c.get("is_bad"))
        flagged = sum(1 for p in processes if p.get("risk") == "HIGH_RISK")

        return score_engine.calculate(
            breaches=breaches,
            anomaly_count=0,
            flagged_processes=flagged,
            bad_connections=bad_conns,
        )
    except Exception as e:
        logger.error("Score calculation error: %s", e)
        raise HTTPException(status_code=500, detail="Score calculation failed.")
