"""
Sentinel-AI — HaveIBeenPwned Service
Checks email addresses against the HIBP breach database.
"""

import httpx
import logging
from app.config import settings

logger = logging.getLogger("sentinel-ai.hibp")


class HIBPService:

    async def check_email(self, email: str) -> list[dict]:
        """Check email against HaveIBeenPwned database."""
        if not settings.HIBP_API_KEY or settings.HIBP_API_KEY == "your_hibp_key_here":
            logger.warning("HIBP API key not configured — returning mock data")
            return self._mock_breaches(email)

        try:
            async with httpx.AsyncClient(timeout=15) as client:
                response = await client.get(
                    f"https://haveibeenpwned.com/api/v3/breachedaccount/{email}",
                    headers={
                        "hibp-api-key": settings.HIBP_API_KEY,
                        "user-agent": "Sentinel-AI-Hackathon",
                    },
                    params={"truncateResponse": "false"}
                )
                if response.status_code == 404:
                    return []  # No breaches found
                if response.status_code == 200:
                    breaches = response.json()
                    return [self._format_breach(b) for b in breaches]
                if response.status_code == 429:
                    logger.warning("HIBP rate limit reached")
                    return []
                logger.warning("HIBP returned status %d", response.status_code)
                return []
        except httpx.TimeoutException:
            logger.error("HIBP request timed out")
            return []
        except Exception as e:
            logger.error("HIBP error: %s", e)
            return []

    def _format_breach(self, raw: dict) -> dict:
        """Format HIBP response to match frontend BreachList component schema."""
        data_classes = raw.get("DataClasses", [])
        severity = "HIGH" if "Passwords" in data_classes else "MEDIUM"
        return {
            "name":         raw.get("Name", "Unknown"),
            "domain":       raw.get("Domain", ""),
            "date":         raw.get("BreachDate", ""),
            "record_count": raw.get("PwnCount", 0),
            "description":  raw.get("Description", "")[:300],
            "data_exposed": data_classes,
            "severity":     severity,
            "is_verified":  raw.get("IsVerified", False),
        }

    def _mock_breaches(self, email: str) -> list[dict]:
        """Return realistic mock breach data for demo/hackathon when API key is not set."""
        return [
            {
                "name": "LinkedIn",
                "domain": "linkedin.com",
                "date": "2021-06-22",
                "record_count": 700000000,
                "description": "In June 2021, a large-scale data scraping incident exposed 700 million LinkedIn user records.",
                "data_exposed": ["Email addresses", "Phone numbers", "Physical addresses", "Geolocation records"],
                "severity": "MEDIUM",
                "is_verified": True,
            },
            {
                "name": "Adobe",
                "domain": "adobe.com",
                "date": "2013-10-04",
                "record_count": 153000000,
                "description": "In October 2013, 153 million Adobe accounts were breached with IDs, usernames, and encrypted passwords.",
                "data_exposed": ["Email addresses", "Passwords", "Usernames", "Password hints"],
                "severity": "HIGH",
                "is_verified": True,
            },
            {
                "name": "Canva",
                "domain": "canva.com",
                "date": "2019-05-24",
                "record_count": 137000000,
                "description": "In May 2019, the graphic design tool Canva suffered a data breach impacting 137 million users.",
                "data_exposed": ["Email addresses", "Usernames", "Names", "Geographic locations"],
                "severity": "MEDIUM",
                "is_verified": True,
            },
        ]


hibp = HIBPService()
