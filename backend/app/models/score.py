"""
Sentinel-AI — Score & AI Chat Pydantic Models
Schemas for security scoring and AI coaching endpoints.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional
import re


class ScoreBreakdown(BaseModel):
    breaches: int = 0
    anomalies: int = 0
    processes: int = 0
    network: int = 0


class ScoreResponse(BaseModel):
    score: int = Field(..., ge=0, le=100)
    grade: str  # A | B | C | F
    label: str  # Good | Fair | Poor | Critical
    breakdown: ScoreBreakdown


class UserContext(BaseModel):
    score: int = Field(default=100, ge=0, le=100)
    breaches: list[dict] = []
    anomalies: list[dict] = []
    flagged_processes: list[str] = []

    @field_validator("flagged_processes")
    @classmethod
    def limit_flagged(cls, v: list[str]) -> list[str]:
        return v[:50]  # Cap to prevent oversized context


class ChatRequest(BaseModel):
    messages: list[dict] = Field(..., max_length=50, description="Chat history (max 50 messages)")
    context: UserContext

    @field_validator("messages")
    @classmethod
    def validate_messages(cls, v: list[dict]) -> list[dict]:
        """Validate and sanitize chat messages — prevent role injection."""
        sanitized = []
        allowed_roles = {"user", "assistant"}
        for msg in v[-50:]:  # Only keep last 50
            role = msg.get("role", "user")
            if role not in allowed_roles:
                role = "user"  # Force unknown roles to user
            content = str(msg.get("content", ""))[:5000]  # Cap per-message length
            sanitized.append({"role": role, "content": content})
        return sanitized


class RecommendRequest(BaseModel):
    email: str = Field(..., min_length=5, max_length=254)
    breaches: list[dict] = []
    score: int = Field(default=100, ge=0, le=100)

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = v.strip().lower()
        pattern = r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
        if not re.match(pattern, v):
            raise ValueError("Invalid email address format")
        return v
