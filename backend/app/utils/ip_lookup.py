"""
Sentinel-AI — IP Geolocation Lookup
Lightweight IP geo lookup using ip-api.com (free, no key required, privacy-friendly).
Falls back gracefully if lookup fails.
"""

import httpx
import ipaddress
from functools import lru_cache

# Country code → flag emoji mapping
_FLAG_OFFSET = 127397


def _country_flag(country_code: str) -> str:
    """Convert ISO country code to flag emoji."""
    try:
        return "".join(chr(ord(c) + _FLAG_OFFSET) for c in country_code.upper())
    except Exception:
        return "🌐"


def _is_private_ip(ip: str) -> bool:
    """Check if IP is private/reserved — skip lookup for these."""
    try:
        return ipaddress.ip_address(ip).is_private
    except ValueError:
        return False


@lru_cache(maxsize=512)
def get_ip_info(ip: str) -> dict:
    """
    Get geolocation info for an IP address.
    Returns dict with country, city, flag keys.
    Uses ip-api.com (free tier, 45 req/min).
    """
    if _is_private_ip(ip):
        return {"country": "Local", "city": "Private Network", "flag": "🏠"}

    try:
        with httpx.Client(timeout=5) as client:
            resp = client.get(
                f"http://ip-api.com/json/{ip}",
                params={"fields": "status,country,city,countryCode"}
            )
            if resp.status_code == 200:
                data = resp.json()
                if data.get("status") == "success":
                    return {
                        "country": data.get("country", "Unknown"),
                        "city": data.get("city", ""),
                        "flag": _country_flag(data.get("countryCode", "")),
                    }
    except Exception:
        pass

    return {"country": "Unknown", "city": "", "flag": "🌐"}
