"""
Sentinel-AI — Analysis Pydantic Models
Request/response schemas for the phishing analyzer endpoints.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional
import re


class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000, description="Text to analyze for phishing")
    url: Optional[str] = Field(None, max_length=2048, description="Optional URL to scan")
    threat_level: Optional[str] = Field(None, description="Threat level for stream endpoint")

    @field_validator("url")
    @classmethod
    def validate_url(cls, v: Optional[str]) -> Optional[str]:
        """Validate and sanitize URL input."""
        if v is None:
            return v
        v = v.strip()
        # Basic URL format validation
        url_pattern = r"^https?://[^\s<>\"'{}|\\^`\[\]]+$"
        if not re.match(url_pattern, v):
            raise ValueError("Invalid URL format. Must start with http:// or https://")
        return v

    @field_validator("threat_level")
    @classmethod
    def validate_threat_level(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in ("SAFE", "SUSPICIOUS", "HIGH_RISK"):
            raise ValueError("threat_level must be SAFE, SUSPICIOUS, or HIGH_RISK")
        return v


class Highlight(BaseModel):
    start: int
    end: int
    type: str
    reason: str
    color: str


class AnalysisResult(BaseModel):
    threat_level: str  # SAFE | SUSPICIOUS | HIGH_RISK
    confidence: int = Field(..., ge=0, le=100)
    tactics: list[str] = []
    highlights: list[Highlight] = []
    explanation: str = ""
    url_scan: Optional[dict] = None
    rule_flags: list[dict] = []
    llm_analysis: Optional[dict] = None
