"""
Sentinel-AI — FastAPI Backend Entry Point
AI-Powered Personal Cybersecurity Coaching Agent

Security measures enforced:
  • Strict CORS (frontend origin only)
  • Security headers middleware
  • Rate limiting on sensitive endpoints
  • Input validation via Pydantic models
  • Error handling that never leaks internals
"""

import time
import logging
from collections import defaultdict
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from app.api.routes import breach, analyzer, monitor, ai, score
from app.api.websocket import router as ws_router
from app.config import settings

# ─── Logging ─────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s │ %(name)-28s │ %(levelname)-7s │ %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("sentinel-ai")

# ─── App ─────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Sentinel-AI",
    version="1.0.0",
    description="AI-Powered Personal Cybersecurity Coaching Agent",
    docs_url="/docs",
    redoc_url=None,  # Disable ReDoc in production
)


# ─── Security Headers Middleware ─────────────────────────────────────────────
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Inject security headers into every response."""

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"
        response.headers["Pragma"] = "no-cache"
        return response


# ─── Rate Limiting Middleware ────────────────────────────────────────────────
class RateLimitMiddleware(BaseHTTPMiddleware):
    """Simple in-memory rate limiting for sensitive endpoints."""

    RATE_LIMITED_PATHS = {
        "/api/v1/breach/check": (10, 60),    # 10 requests per 60 seconds
        "/api/v1/breach/score": (10, 60),
        "/api/v1/ai/chat": (30, 60),          # 30 requests per 60 seconds
        "/api/v1/ai/recommend": (10, 60),
        "/api/v1/analyze/text": (20, 60),
        "/api/v1/analyze/stream": (20, 60),
    }

    def __init__(self, app):
        super().__init__(app)
        self._requests: dict[str, list[float]] = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        if path in self.RATE_LIMITED_PATHS:
            max_requests, window = self.RATE_LIMITED_PATHS[path]
            client_ip = request.client.host if request.client else "unknown"
            key = f"{client_ip}:{path}"
            now = time.time()

            # Clean old entries
            self._requests[key] = [
                t for t in self._requests[key] if now - t < window
            ]

            if len(self._requests[key]) >= max_requests:
                logger.warning("Rate limit exceeded: %s from %s", path, client_ip)
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Too many requests. Please try again later."},
                )

            self._requests[key].append(now)

        return await call_next(request)


# ─── CORS ────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["GET", "POST"],  # Only methods we actually use
    allow_headers=["Content-Type", "Authorization"],
)

# Security middlewares (order matters: outer middleware runs first)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitMiddleware)

# ─── Routes ──────────────────────────────────────────────────────────────────
app.include_router(breach.router,    prefix="/api/v1/breach",   tags=["Breach"])
app.include_router(analyzer.router,  prefix="/api/v1/analyze",  tags=["Analyzer"])
app.include_router(monitor.router,   prefix="/api/v1/monitor",  tags=["Monitor"])
app.include_router(ai.router,        prefix="/api/v1/ai",       tags=["AI"])
app.include_router(score.router,     prefix="/api/v1/score",    tags=["Score"])
app.include_router(ws_router)


# ─── Global Exception Handler ───────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Never leak internal error details to the client."""
    logger.error("Unhandled exception on %s: %s", request.url.path, exc)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal error occurred. Please try again."},
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )


# ─── Health Check ────────────────────────────────────────────────────────────
@app.get("/health")
async def health():
    """Health check endpoint — returns server status and loaded model."""
    return {
        "status": "ok",
        "service": "Sentinel-AI",
        "model": settings.LM_STUDIO_MODEL,
    }


# ─── Startup Event ──────────────────────────────────────────────────────────
@app.on_event("startup")
async def startup():
    logger.info("🛡️  Sentinel-AI Backend starting up...")
    logger.info("   LM Studio URL:  %s", settings.LM_STUDIO_BASE_URL)
    logger.info("   Model:          %s", settings.LM_STUDIO_MODEL)
    logger.info("   Frontend CORS:  %s", settings.FRONTEND_URL)
    logger.info("   Security: CORS ✓ | Headers ✓ | Rate Limit ✓ | Validation ✓")
