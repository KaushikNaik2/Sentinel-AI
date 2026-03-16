"""
Sentinel-AI — Breach Pydantic Models
Request/response schemas for the breach checking endpoints.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional
import re


class BreachCheckRequest(BaseModel):
    email: str = Field(..., min_length=5, max_length=254, description="Email address to check")

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        """Strict email validation — prevent injection via email field."""
        v = v.strip().lower()
        pattern = r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
        if not re.match(pattern, v):
            raise ValueError("Invalid email address format")
        if len(v) > 254:
            raise ValueError("Email address too long")
        return v


class BreachInfo(BaseModel):
    name: str
    domain: Optional[str] = None
    date: Optional[str] = None
    record_count: Optional[int] = None
    description: str = ""
    data_exposed: list[str] = []
    severity: str = "MEDIUM"  # HIGH | MEDIUM | LOW
    is_verified: bool = False


class BreachCheckResponse(BaseModel):
    breaches: list[BreachInfo] = []
    total_breaches: int = 0
    score_impact: int = 0
