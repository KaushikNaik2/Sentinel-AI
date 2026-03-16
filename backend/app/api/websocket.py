"""
Sentinel-AI — WebSocket Monitor Feed
Real-time anomaly event stream via WebSocket.
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json
import logging
from app.services.system_monitor import monitor
from app.config import settings

logger = logging.getLogger("sentinel-ai.websocket")

router = APIRouter()


@router.websocket("/ws/monitor")
async def monitor_websocket(websocket: WebSocket):
    """Real-time system anomaly stream via WebSocket."""
    await websocket.accept()
    logger.info("WebSocket client connected")
    try:
        async for event in monitor.stream_anomalies(settings.MONITOR_INTERVAL_SECONDS):
            await websocket.send_text(json.dumps(event))
    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected")
    except Exception as e:
        logger.error("WebSocket error: %s", e)
    finally:
        logger.info("WebSocket connection closed")
