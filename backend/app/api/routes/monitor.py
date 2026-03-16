"""
Sentinel-AI — Monitor Routes
System monitoring endpoints for processes, network, and metrics.
"""

from fastapi import APIRouter
import logging
from app.services.system_monitor import monitor

logger = logging.getLogger("sentinel-ai.routes.monitor")

router = APIRouter()


@router.get("/processes")
async def get_processes():
    """Get running processes with security risk assessment."""
    try:
        return monitor.get_processes()
    except Exception as e:
        logger.error("Process listing error: %s", e)
        return []


@router.get("/network")
async def get_network():
    """Get active network connections with geo-IP enrichment."""
    try:
        return monitor.get_network_connections()
    except Exception as e:
        logger.error("Network listing error: %s", e)
        return []


@router.get("/metrics")
async def get_metrics():
    """Get current CPU, RAM, disk, and network statistics."""
    try:
        return monitor.get_metrics()
    except Exception as e:
        logger.error("Metrics error: %s", e)
        return {
            "cpu_percent": 0, "ram_percent": 0, "ram_used_gb": 0,
            "disk_percent": 0, "net_sent_mb": 0, "net_recv_mb": 0,
            "process_count": 0, "timestamp": "",
        }
