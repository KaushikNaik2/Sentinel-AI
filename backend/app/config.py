"""
Sentinel-AI Backend Configuration
Loads settings from .env with strict type validation.
"""

from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    # LM Studio
    LM_STUDIO_BASE_URL: str = Field(default="http://localhost:1234/v1")
    LM_STUDIO_MODEL: str = Field(default="mistral-7b-instruct-v0.3")

    # External APIs
    HIBP_API_KEY: str = Field(default="")
    VIRUSTOTAL_API_KEY: str = Field(default="")

    # App
    FRONTEND_URL: str = Field(default="http://localhost:5173")
    MONITOR_INTERVAL_SECONDS: int = Field(default=3, ge=1, le=60)
    ANOMALY_THRESHOLD_CPU: int = Field(default=85, ge=1, le=100)
    ANOMALY_THRESHOLD_RAM: int = Field(default=90, ge=1, le=100)
    ANOMALY_THRESHOLD_CONNECTIONS: int = Field(default=50, ge=1, le=500)

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


settings = Settings()
