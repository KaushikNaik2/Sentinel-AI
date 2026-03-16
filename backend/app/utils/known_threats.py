"""
Sentinel-AI — Known Threats Database
Loads threat intelligence data: bad IPs, suspicious process names, phishing patterns.
"""

import os
import json
from pathlib import Path

# Resolve data directory relative to project root
_DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"

# ─── Bad IPs ──────────────────────────────────────────────────────────────────
_bad_ips_path = _DATA_DIR / "known_bad_ips.txt"
if _bad_ips_path.exists():
    with open(_bad_ips_path, "r") as f:
        BAD_IPS: set[str] = {
            line.strip() for line in f
            if line.strip() and not line.strip().startswith("#")
        }
else:
    BAD_IPS = set()

# ─── Suspicious Process Names ────────────────────────────────────────────────
# Common crypto miners, pen-test tools, RATs, and backdoors
SUSPICIOUS_PROCESS_NAMES: set[str] = {
    # Crypto miners
    "miner", "xmrig", "cryptonight", "coinhive", "minerd", "cgminer", "bfgminer",
    # Network recon / exploitation
    "netcat", "ncat", "nc.exe", "nmap", "masscan", "hydra", "medusa",
    # Credential theft
    "mimikatz", "lazagne", "hashcat",
    # RATs / backdoors
    "meterpreter", "cobalt", "empire",
    # Packet sniffing (flag for awareness)
    "wireshark", "tcpdump", "ettercap",
    # Reverse shells
    "reverse_shell", "revshell",
}

# ─── Phishing Patterns ───────────────────────────────────────────────────────
_patterns_path = _DATA_DIR / "phishing_patterns.json"
if _patterns_path.exists():
    with open(_patterns_path, "r") as f:
        PHISHING_PATTERNS: list[dict] = json.load(f)
else:
    PHISHING_PATTERNS = []


def is_bad_ip(ip: str) -> bool:
    """Check if an IP is in the known malicious IP set."""
    return ip in BAD_IPS


def is_suspicious_process(name: str) -> bool:
    """Check if a process name matches known suspicious software."""
    name_lower = name.lower()
    return any(s in name_lower for s in SUSPICIOUS_PROCESS_NAMES)
