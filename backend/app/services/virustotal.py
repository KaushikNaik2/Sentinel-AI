"""
Sentinel-AI — VirusTotal URL Scanner
Scans URLs against VirusTotal's database for malicious content.
"""

import httpx
import logging
from app.config import settings

logger = logging.getLogger("sentinel-ai.virustotal")


async def scan_url(url: str) -> dict:
    """
    Scan a URL using the VirusTotal API.
    Returns scan results with malicious/suspicious verdict.
    """
    if not settings.VIRUSTOTAL_API_KEY or settings.VIRUSTOTAL_API_KEY == "your_vt_key_here":
        logger.warning("VirusTotal API key not configured — returning mock scan")
        return _mock_scan(url)

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            # Submit URL for scanning
            response = await client.post(
                "https://www.virustotal.com/api/v3/urls",
                headers={
                    "x-apikey": settings.VIRUSTOTAL_API_KEY,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                data={"url": url}
            )

            if response.status_code == 200:
                data = response.json()
                analysis_id = data.get("data", {}).get("id", "")

                # Get analysis results
                result_resp = await client.get(
                    f"https://www.virustotal.com/api/v3/analyses/{analysis_id}",
                    headers={"x-apikey": settings.VIRUSTOTAL_API_KEY}
                )

                if result_resp.status_code == 200:
                    result_data = result_resp.json()
                    stats = result_data.get("data", {}).get("attributes", {}).get("stats", {})
                    return {
                        "url": url,
                        "malicious": stats.get("malicious", 0) > 0,
                        "suspicious": stats.get("suspicious", 0) > 0,
                        "stats": {
                            "malicious": stats.get("malicious", 0),
                            "suspicious": stats.get("suspicious", 0),
                            "harmless": stats.get("harmless", 0),
                            "undetected": stats.get("undetected", 0),
                        },
                        "status": "completed",
                    }

            logger.warning("VirusTotal returned status %d", response.status_code)
            return {"url": url, "malicious": False, "status": "error"}

    except httpx.TimeoutException:
        logger.error("VirusTotal request timed out")
        return {"url": url, "malicious": False, "status": "timeout"}
    except Exception as e:
        logger.error("VirusTotal error: %s", e)
        return {"url": url, "malicious": False, "status": "error"}


def _mock_scan(url: str) -> dict:
    """Return mock URL scan result for demo when API key is not set."""
    # Heuristic: check for obviously suspicious URL patterns
    suspicious_patterns = [
        "bit.ly", "tinyurl", "goo.gl", "t.co",
        "login", "verify", "secure", "account",
        "bank", "paypal", "amazon",
    ]
    url_lower = url.lower()
    is_suspicious = any(p in url_lower for p in suspicious_patterns)

    return {
        "url": url,
        "malicious": is_suspicious,
        "suspicious": is_suspicious,
        "stats": {
            "malicious": 3 if is_suspicious else 0,
            "suspicious": 2 if is_suspicious else 0,
            "harmless": 60,
            "undetected": 5,
        },
        "status": "mock",
    }
