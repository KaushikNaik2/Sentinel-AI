"""
Sentinel-AI — Analyzer Routes
Phishing analysis endpoints with streaming AI explanation.
"""

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import logging
from app.services.phishing_analyzer import analyzer
from app.models.analysis import AnalyzeRequest

logger = logging.getLogger("sentinel-ai.routes.analyzer")

router = APIRouter()


@router.post("/text")
async def analyze_text(req: AnalyzeRequest):
    """Analyze text for phishing/scam indicators using rule-based + AI analysis."""
    try:
        return await analyzer.analyze(req.text, req.url)
    except Exception as e:
        logger.error("Analysis error: %s", e)
        return {
            "threat_level": "SAFE",
            "confidence": 0,
            "explanation": "Analysis temporarily unavailable. Please try again.",
            "tactics": [],
            "highlights": [],
            "rule_flags": [],
        }


@router.post("/stream")
async def stream_explanation(req: AnalyzeRequest):
    """Stream AI explanation of phishing analysis results via SSE."""

    async def generator():
        try:
            async for chunk in analyzer.stream_explanation(
                req.text, req.threat_level or "SUSPICIOUS"
            ):
                yield f"data: {chunk}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            logger.error("Stream error: %s", e)
            yield f"data: Analysis streaming unavailable.\n\n"
            yield "data: [DONE]\n\n"

    return StreamingResponse(generator(), media_type="text/event-stream")
