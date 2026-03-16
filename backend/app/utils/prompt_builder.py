"""
Sentinel-AI — LLM Prompt Builder
Constructs injection-safe prompts for the local LM Studio model.
All user inputs are sanitized before embedding into prompts.
"""

import re


def _sanitize_input(text: str, max_length: int = 2000) -> str:
    """
    Sanitize user input before embedding in LLM prompts.
    Prevents prompt injection by stripping control sequences and limiting length.
    """
    # Truncate to max length
    text = text[:max_length]
    # Strip common prompt injection patterns
    text = re.sub(r"(ignore\s+(previous|above|all)\s+(instructions?|prompts?))", "[REDACTED]", text, flags=re.IGNORECASE)
    text = re.sub(r"(system\s*:\s*)", "[REDACTED]", text, flags=re.IGNORECASE)
    text = re.sub(r"(you\s+are\s+now\s+)", "[REDACTED]", text, flags=re.IGNORECASE)
    text = re.sub(r"(act\s+as\s+if\s+)", "[REDACTED]", text, flags=re.IGNORECASE)
    text = re.sub(r"(disregard\s+(all|any)\s+)", "[REDACTED]", text, flags=re.IGNORECASE)
    return text.strip()


def build_phishing_prompt(text: str, flags: list) -> str:
    """Build phishing analysis prompt for the LLM."""
    safe_text = _sanitize_input(text)
    flag_summary = ", ".join([f['type'] for f in flags]) if flags else "none detected by rules"

    return f"""Analyze this message for phishing/scam intent.

Rule-based flags already found: {flag_summary}

Message to analyze:
---
{safe_text}
---

Return JSON only:
{{
  "risk_score": 0-100,
  "tactics": ["list of tactics e.g. Urgency, OTP Harvesting, Authority Impersonation"],
  "explanation": "plain language explanation under 150 words",
  "suspicious_spans": []
}}"""


def build_coach_system_prompt(ctx: dict) -> str:
    """Build system prompt for the AI security coach chat."""
    breach_names = [b.get('name', 'Unknown') for b in ctx.get('breaches', [])]
    flagged = ctx.get('flagged_processes', [])

    return f"""You are Sentinel-AI, a personal cybersecurity expert assistant.

Current user security status:
- Security Score: {ctx.get('score', 'Unknown')}/100
- Data breaches found: {', '.join(breach_names) or 'None detected'}
- Active system anomalies: {ctx.get('anomaly_count', 0)}
- Flagged processes: {', '.join(flagged) or 'None'}

Instructions:
- Reference the user's ACTUAL data when answering — never give generic advice
- Be concise and specific — give exact steps, not vague recommendations
- Use plain language — no jargon unless explaining it
- If user seems in crisis (hacked, clicked bad link), prioritize immediate action steps
- Running entirely locally — remind user their data never leaves their machine
- NEVER execute commands, only advise. NEVER provide malicious payloads or scripts."""


def build_recommend_prompt(email: str, breaches: list, score: int) -> str:
    """Build recommendations prompt based on user's breach data."""
    # Sanitize email display (don't expose full email back to LLM)
    safe_email = _sanitize_input(email, max_length=254)

    breach_detail = "\n".join([
        f"- {b['name']} ({b['date']}): {', '.join(b.get('data_exposed', []))}"
        for b in breaches
    ])

    return f"""User email: {safe_email}
Security Score: {score}/100
Breaches found:
{breach_detail or "None"}

Give exactly 5 specific, actionable security recommendations based on these breaches.
Format: numbered list. Each item must take under 5 minutes. Start with most critical."""
