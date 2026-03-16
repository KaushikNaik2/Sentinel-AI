# CyberGuard AI — Backend PRD
**Product**: AI-Powered Personal Cybersecurity Coaching Agent  
**Version**: 1.0 — Hackathon MVP  
**Stack**: Python 3.11 + FastAPI + LM Studio (local LLM) + WebSockets + psutil  
**Reference**: Implements all data endpoints required by `FRONTEND_PRD.md`

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                   │
│         localhost:5173  —  references FRONTEND_PRD.md       │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP + WebSocket
┌────────────────────▼────────────────────────────────────────┐
│                 FASTAPI BACKEND  :8000                       │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │  REST API   │  │  WebSocket   │  │   LM Studio Proxy  │  │
│  │  /api/v1/*  │  │  /ws/monitor │  │   /ai/*  (stream)  │  │
│  └─────────────┘  └──────────────┘  └────────────────────┘  │
└──────┬────────────────────┬──────────────────────┬──────────┘
       │                    │                      │
┌──────▼──────┐   ┌─────────▼──────┐   ┌──────────▼─────────┐
│  LM STUDIO  │   │ SYSTEM (psutil)│   │  EXTERNAL APIs     │
│ :1234       │   │ Processes      │   │  HIBP, VirusTotal  │
│ Mistral 7B  │   │ Network conns  │   │  Google Safe Browse│
│ Llama 3.1 8B│   │ CPU/RAM/Disk   │   │                    │
└─────────────┘   └────────────────┘   └────────────────────┘
```

---

## 2. Project Structure

```
cyberguard-backend/
├── main.py                        # FastAPI app entry point
├── requirements.txt
├── .env                           # API keys, config
├── .env.example
│
├── app/
│   ├── __init__.py
│   ├── config.py                  # Settings via pydantic-settings
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes/
│   │   │   ├── breach.py          # /api/v1/breach/*
│   │   │   ├── analyzer.py        # /api/v1/analyze/*
│   │   │   ├── monitor.py         # /api/v1/monitor/*
│   │   │   ├── ai.py              # /api/v1/ai/* (streaming)
│   │   │   └── score.py           # /api/v1/score/*
│   │   └── websocket.py           # /ws/monitor  (live feed)
│   │
│   ├── services/
│   │   ├── lmstudio.py            # LM Studio API client
│   │   ├── hibp.py                # HaveIBeenPwned API
│   │   ├── virustotal.py          # VirusTotal URL scanner
│   │   ├── system_monitor.py      # psutil — processes, network
│   │   ├── anomaly_detector.py    # Rule-based + AI anomaly detection
│   │   ├── phishing_analyzer.py   # NLP phishing analysis
│   │   └── score_engine.py        # Security score calculation
│   │
│   ├── models/
│   │   ├── breach.py              # Pydantic schemas
│   │   ├── analysis.py
│   │   ├── monitor.py
│   │   └── score.py
│   │
│   └── utils/
│       ├── ip_lookup.py           # Geo-IP for network connections
│       ├── known_threats.py       # Local blacklist / IOC list
│       └── prompt_builder.py      # LLM prompt templates
│
└── data/
    ├── known_bad_ips.txt          # Blacklisted IP list
    ├── phishing_patterns.json     # Rule-based phishing patterns
    └── common_passwords.txt       # Top 10k passwords for strength check
```

---

## 3. Setup & Configuration

### 3.1 `.env`
```env
# LM Studio — local, no key needed
LM_STUDIO_BASE_URL=http://localhost:1234/v1
LM_STUDIO_MODEL=mistral-7b-instruct-v0.3   # or llama-3.1-8b-instruct

# External APIs (free tier)
HIBP_API_KEY=your_hibp_key_here
VIRUSTOTAL_API_KEY=your_vt_key_here

# App
FRONTEND_URL=http://localhost:5173
MONITOR_INTERVAL_SECONDS=3
ANOMALY_THRESHOLD_CPU=85
ANOMALY_THRESHOLD_RAM=90
ANOMALY_THRESHOLD_CONNECTIONS=50
```

### 3.2 `requirements.txt`
```
fastapi==0.115.0
uvicorn[standard]==0.31.0
pydantic==2.9.0
pydantic-settings==2.5.0
httpx==0.27.2
websockets==13.1
psutil==6.0.0
python-dotenv==1.0.1
geoip2==4.8.0          # Geo-IP lookups
python-multipart==0.0.9
asyncio==3.4.3
```

### 3.3 `main.py`
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import breach, analyzer, monitor, ai, score
from app.api.websocket import router as ws_router
from app.config import settings

app = FastAPI(title="CyberGuard AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(breach.router,   prefix="/api/v1/breach",   tags=["Breach"])
app.include_router(analyzer.router, prefix="/api/v1/analyze",  tags=["Analyzer"])
app.include_router(monitor.router,  prefix="/api/v1/monitor",  tags=["Monitor"])
app.include_router(ai.router,       prefix="/api/v1/ai",       tags=["AI"])
app.include_router(score.router,    prefix="/api/v1/score",    tags=["Score"])
app.include_router(ws_router)

@app.get("/health")
async def health():
    return {"status": "ok", "model": settings.LM_STUDIO_MODEL}
```

---

## 4. Services — Full Implementation

### 4.1 LM Studio Service (`services/lmstudio.py`)

LM Studio exposes an OpenAI-compatible API on `:1234`. This service handles both regular and streaming responses.

```python
import httpx
import json
from app.config import settings

class LMStudioClient:
    def __init__(self):
        self.base_url = settings.LM_STUDIO_BASE_URL
        self.model = settings.LM_STUDIO_MODEL

    async def complete(self, messages: list[dict], temperature=0.3) -> str:
        """Single completion — returns full response text."""
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                json={
                    "model": self.model,
                    "messages": messages,
                    "temperature": temperature,
                    "max_tokens": 1024,
                    "stream": False,
                }
            )
            data = response.json()
            return data["choices"][0]["message"]["content"]

    async def stream(self, messages: list[dict], temperature=0.3):
        """Streaming completion — yields text chunks for SSE."""
        async with httpx.AsyncClient(timeout=120) as client:
            async with client.stream(
                "POST",
                f"{self.base_url}/chat/completions",
                json={
                    "model": self.model,
                    "messages": messages,
                    "temperature": temperature,
                    "max_tokens": 1024,
                    "stream": True,
                }
            ) as response:
                async for line in response.aiter_lines():
                    if line.startswith("data: ") and line != "data: [DONE]":
                        try:
                            chunk = json.loads(line[6:])
                            delta = chunk["choices"][0]["delta"].get("content", "")
                            if delta:
                                yield delta
                        except json.JSONDecodeError:
                            continue

lm_client = LMStudioClient()
```

---

### 4.2 System Monitor (`services/system_monitor.py`)

Core service for Dashboard Page 1 and Monitor Page 3 in `FRONTEND_PRD.md`.

```python
import psutil
import asyncio
from datetime import datetime
from typing import AsyncGenerator
from app.utils.ip_lookup import get_ip_info
from app.utils.known_threats import is_suspicious_process, is_bad_ip

class SystemMonitor:

    def get_processes(self) -> list[dict]:
        """Returns all running processes with risk assessment."""
        processes = []
        for proc in psutil.process_iter(['pid', 'name', 'cpu_percent',
                                          'memory_percent', 'connections', 'status']):
            try:
                info = proc.info
                risk = self._assess_process_risk(info)
                processes.append({
                    "pid":        info['pid'],
                    "name":       info['name'],
                    "cpu":        round(info['cpu_percent'], 1),
                    "ram":        round(info['memory_percent'], 1),
                    "status":     info['status'],
                    "risk":       risk,           # SAFE / SUSPICIOUS / HIGH_RISK
                    "connections": len(info.get('connections') or []),
                })
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
        return sorted(processes, key=lambda x: x['cpu'], reverse=True)[:50]

    def get_network_connections(self) -> list[dict]:
        """Returns active network connections with geo-IP data."""
        connections = []
        for conn in psutil.net_connections(kind='inet'):
            if conn.status == 'ESTABLISHED' and conn.raddr:
                ip = conn.raddr.ip
                port = conn.raddr.port
                geo = get_ip_info(ip)
                connections.append({
                    "local_port":  conn.laddr.port,
                    "remote_ip":   ip,
                    "remote_port": port,
                    "status":      conn.status,
                    "country":     geo.get("country", "Unknown"),
                    "city":        geo.get("city", ""),
                    "flag":        geo.get("flag", "🌐"),
                    "is_bad":      is_bad_ip(ip),
                    "pid":         conn.pid,
                })
        return connections

    def get_metrics(self) -> dict:
        """Returns current CPU, RAM, disk, network stats."""
        net = psutil.net_io_counters()
        return {
            "cpu_percent":    psutil.cpu_percent(interval=0.1),
            "ram_percent":    psutil.virtual_memory().percent,
            "ram_used_gb":    round(psutil.virtual_memory().used / 1e9, 1),
            "disk_percent":   psutil.disk_usage('/').percent,
            "net_sent_mb":    round(net.bytes_sent / 1e6, 1),
            "net_recv_mb":    round(net.bytes_recv / 1e6, 1),
            "process_count":  len(psutil.pids()),
            "timestamp":      datetime.now().isoformat(),
        }

    def _assess_process_risk(self, info: dict) -> str:
        """Rule-based risk assessment for a process."""
        name = (info.get('name') or '').lower()
        conns = len(info.get('connections') or [])
        cpu = info.get('cpu_percent', 0)

        if is_suspicious_process(name):
            return "HIGH_RISK"
        if conns > 20 or (cpu > 80 and name not in ['chrome', 'firefox', 'code']):
            return "SUSPICIOUS"
        return "SAFE"

    async def stream_anomalies(self, interval: int = 3) -> AsyncGenerator[dict, None]:
        """Continuously monitors and yields anomaly events."""
        while True:
            metrics = self.get_metrics()
            connections = self.get_network_connections()
            processes = self.get_processes()

            # CPU spike anomaly
            if metrics['cpu_percent'] > 85:
                yield {
                    "type": "CPU_SPIKE",
                    "severity": "HIGH",
                    "message": f"CPU at {metrics['cpu_percent']}%",
                    "timestamp": metrics['timestamp'],
                }

            # Suspicious process anomaly
            for p in processes:
                if p['risk'] == 'HIGH_RISK':
                    yield {
                        "type": "SUSPICIOUS_PROCESS",
                        "severity": "HIGH",
                        "message": f"Suspicious process: {p['name']} (PID {p['pid']})",
                        "timestamp": metrics['timestamp'],
                        "data": p,
                    }

            # Bad IP connection
            for conn in connections:
                if conn['is_bad']:
                    yield {
                        "type": "BAD_IP_CONNECTION",
                        "severity": "CRITICAL",
                        "message": f"Connection to known malicious IP: {conn['remote_ip']}",
                        "timestamp": metrics['timestamp'],
                        "data": conn,
                    }

            await asyncio.sleep(interval)

monitor = SystemMonitor()
```

---

### 4.3 Phishing Analyzer (`services/phishing_analyzer.py`)

Serves the Analyzer page (Page 2) in `FRONTEND_PRD.md`. Combines rule-based + LLM analysis.

```python
import re
import json
from app.services.lmstudio import lm_client
from app.services.virustotal import scan_url
from app.utils.prompt_builder import build_phishing_prompt
from app.utils.known_threats import PHISHING_PATTERNS

class PhishingAnalyzer:

    async def analyze(self, text: str, url: str = None) -> dict:
        """Full phishing analysis: rule-based + LLM + URL scan."""

        # Step 1: Rule-based pattern matching
        rule_flags = self._check_patterns(text)

        # Step 2: URL scanning via VirusTotal
        url_result = None
        if url:
            url_result = await scan_url(url)

        # Step 3: LLM deep analysis
        prompt = build_phishing_prompt(text, rule_flags)
        messages = [
            {"role": "system", "content": (
                "You are a cybersecurity expert specializing in phishing detection. "
                "Analyze text for scam/phishing indicators. Return ONLY valid JSON. "
                "Be specific about what makes content suspicious."
            )},
            {"role": "user", "content": prompt}
        ]
        llm_raw = await lm_client.complete(messages, temperature=0.1)
        llm_result = self._parse_llm_response(llm_raw)

        # Step 4: Merge and score
        score = self._calculate_threat_score(rule_flags, llm_result, url_result)

        return {
            "threat_level":   self._score_to_level(score),   # SAFE/SUSPICIOUS/HIGH_RISK
            "confidence":     score,
            "rule_flags":     rule_flags,
            "llm_analysis":   llm_result,
            "url_scan":       url_result,
            "highlights":     self._build_highlights(text, rule_flags, llm_result),
            "explanation":    llm_result.get("explanation", ""),
            "tactics":        llm_result.get("tactics", []),
        }

    async def stream_explanation(self, text: str, threat_level: str):
        """Stream AI explanation for the Analyzer page typewriter effect."""
        messages = [
            {"role": "system", "content": (
                "You are a cybersecurity expert. Explain phishing threats in plain language. "
                "Be educational — help the user understand WHY something is dangerous. "
                "Use bullet points. Keep it under 200 words."
            )},
            {"role": "user", "content": (
                f"This message was classified as {threat_level}. "
                f"Explain why in plain language:\n\n{text[:1000]}"
            )}
        ]
        async for chunk in lm_client.stream(messages):
            yield chunk

    def _check_patterns(self, text: str) -> list[dict]:
        """Fast regex-based pattern matching against known phishing patterns."""
        flags = []
        text_lower = text.lower()
        for pattern in PHISHING_PATTERNS:
            matches = re.finditer(pattern['regex'], text_lower)
            for match in matches:
                flags.append({
                    "type":    pattern['type'],
                    "phrase":  match.group(),
                    "start":   match.start(),
                    "end":     match.end(),
                    "severity": pattern['severity'],
                    "reason":  pattern['reason'],
                })
        return flags

    def _build_highlights(self, text: str, flags: list, llm: dict) -> list[dict]:
        """Build highlight spans for ResultHighlighter component in frontend."""
        highlights = []
        for flag in flags:
            highlights.append({
                "start":  flag['start'],
                "end":    flag['end'],
                "type":   flag['type'],
                "reason": flag['reason'],
                "color":  "red" if flag['severity'] == "HIGH" else "orange",
            })
        # Add LLM-identified spans if positions returned
        for span in llm.get("suspicious_spans", []):
            highlights.append(span)
        return highlights

    def _calculate_threat_score(self, flags, llm, url) -> int:
        score = 0
        score += min(len(flags) * 15, 60)          # rule flags: max 60 pts
        score += llm.get("risk_score", 0) * 0.3    # LLM: max 30 pts
        if url and url.get("malicious"):
            score += 40                             # malicious URL: +40
        return min(int(score), 100)

    def _score_to_level(self, score: int) -> str:
        if score >= 70: return "HIGH_RISK"
        if score >= 40: return "SUSPICIOUS"
        return "SAFE"

    def _parse_llm_response(self, raw: str) -> dict:
        try:
            start = raw.find('{')
            end = raw.rfind('}') + 1
            return json.loads(raw[start:end])
        except Exception:
            return {"risk_score": 50, "tactics": [], "explanation": raw[:500]}

analyzer = PhishingAnalyzer()
```

---

### 4.4 HIBP Service (`services/hibp.py`)

Serves the Breach Check page (Page 4) in `FRONTEND_PRD.md`.

```python
import httpx
from app.config import settings

class HIBPService:

    async def check_email(self, email: str) -> list[dict]:
        """Check email against HaveIBeenPwned database."""
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.get(
                f"https://haveibeenpwned.com/api/v3/breachedaccount/{email}",
                headers={
                    "hibp-api-key": settings.HIBP_API_KEY,
                    "user-agent": "CyberGuard-AI-Hackathon",
                },
                params={"truncateResponse": "false"}
            )
            if response.status_code == 404:
                return []      # No breaches
            if response.status_code == 200:
                breaches = response.json()
                return [self._format_breach(b) for b in breaches]
            return []

    def _format_breach(self, raw: dict) -> dict:
        """Format HIBP response to match frontend BreachList component schema."""
        data_classes = raw.get("DataClasses", [])
        severity = "HIGH" if "Passwords" in data_classes else "MEDIUM"
        return {
            "name":         raw.get("Name"),
            "domain":       raw.get("Domain"),
            "date":         raw.get("BreachDate"),
            "record_count": raw.get("PwnCount"),
            "description":  raw.get("Description", "")[:300],
            "data_exposed": data_classes,
            "severity":     severity,
            "is_verified":  raw.get("IsVerified", False),
        }

hibp = HIBPService()
```

---

### 4.5 Score Engine (`services/score_engine.py`)

Calculates the Security Score shown on Dashboard + Breach pages.

```python
class ScoreEngine:

    def calculate(self,
                  breaches: list,
                  anomaly_count: int,
                  flagged_processes: int,
                  bad_connections: int) -> dict:

        score = 100

        # Deductions
        score -= min(len(breaches) * 12, 40)           # breaches: -12 each, max -40
        score -= min(anomaly_count * 5, 20)             # anomalies: -5 each, max -20
        score -= min(flagged_processes * 8, 24)         # bad processes: -8 each, max -24
        score -= min(bad_connections * 15, 30)          # bad IPs: -15 each, max -30

        password_breach = any(
            "Passwords" in b.get("data_exposed", []) for b in breaches
        )
        if password_breach:
            score -= 15

        score = max(0, min(score, 100))

        return {
            "score":    score,
            "grade":    self._grade(score),
            "label":    self._label(score),
            "breakdown": {
                "breaches":   min(len(breaches) * 12, 40),
                "anomalies":  min(anomaly_count * 5, 20),
                "processes":  min(flagged_processes * 8, 24),
                "network":    min(bad_connections * 15, 30),
            }
        }

    def _grade(self, score: int) -> str:
        if score >= 80: return "A"
        if score >= 60: return "B"
        if score >= 40: return "C"
        return "F"

    def _label(self, score: int) -> str:
        if score >= 80: return "Good"
        if score >= 60: return "Fair"
        if score >= 40: return "Poor"
        return "Critical"

score_engine = ScoreEngine()
```

---

## 5. API Routes — Full Spec

### 5.1 Breach Routes (`/api/v1/breach`)

```python
# POST /api/v1/breach/check
# Body: { "email": "user@example.com" }
# Response: { breaches: [...], score_impact: int }

# GET /api/v1/breach/score?email=...
# Response: { score: 72, grade: "B", breakdown: {...} }
```

### 5.2 Analyzer Routes (`/api/v1/analyze`)

```python
# POST /api/v1/analyze/text
# Body: { "text": "...", "url": "..." }
# Response: AnalysisResult (see models/analysis.py)

# POST /api/v1/analyze/stream
# Body: { "text": "...", "threat_level": "HIGH_RISK" }
# Response: text/event-stream — streams AI explanation tokens
```

```python
# routes/analyzer.py
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.services.phishing_analyzer import analyzer
from app.models.analysis import AnalyzeRequest

router = APIRouter()

@router.post("/text")
async def analyze_text(req: AnalyzeRequest):
    return await analyzer.analyze(req.text, req.url)

@router.post("/stream")
async def stream_explanation(req: AnalyzeRequest):
    async def generator():
        async for chunk in analyzer.stream_explanation(req.text, req.threat_level):
            yield f"data: {chunk}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(generator(), media_type="text/event-stream")
```

### 5.3 Monitor Routes (`/api/v1/monitor`)

```python
# GET /api/v1/monitor/processes
# Response: [ { pid, name, cpu, ram, risk, connections } ]

# GET /api/v1/monitor/network
# Response: [ { remote_ip, port, country, flag, is_bad, pid } ]

# GET /api/v1/monitor/metrics
# Response: { cpu_percent, ram_percent, disk_percent, net_*, timestamp }
```

### 5.4 AI Routes (`/api/v1/ai`)

```python
# POST /api/v1/ai/chat  (streaming)
# Body: { messages: [...], context: { score, breaches, anomalies } }
# Response: text/event-stream

# POST /api/v1/ai/recommend
# Body: { email, breaches, score }
# Response: streaming recommendations list
```

```python
# routes/ai.py
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.services.lmstudio import lm_client
from app.utils.prompt_builder import build_coach_system_prompt, build_recommend_prompt
from app.models.score import ChatRequest, RecommendRequest

router = APIRouter()

@router.post("/chat")
async def chat_stream(req: ChatRequest):
    system_prompt = build_coach_system_prompt(req.context)
    messages = [{"role": "system", "content": system_prompt}] + req.messages

    async def generator():
        async for chunk in lm_client.stream(messages):
            yield f"data: {chunk}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(generator(), media_type="text/event-stream")

@router.post("/recommend")
async def stream_recommendations(req: RecommendRequest):
    prompt = build_recommend_prompt(req.email, req.breaches, req.score)
    messages = [
        {"role": "system", "content": (
            "You are a personal cybersecurity expert. "
            "Give specific, actionable recommendations based on the user's actual breach data. "
            "Format as a numbered list. Each item should take under 5 minutes to complete."
        )},
        {"role": "user", "content": prompt}
    ]

    async def generator():
        async for chunk in lm_client.stream(messages):
            yield f"data: {chunk}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(generator(), media_type="text/event-stream")
```

### 5.5 WebSocket — Live Monitor Feed

Serves the AnomalyFeed component on Dashboard Page 1 via WebSocket.

```python
# app/api/websocket.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import json
from app.services.system_monitor import monitor
from app.config import settings

router = APIRouter()

@router.websocket("/ws/monitor")
async def monitor_websocket(websocket: WebSocket):
    await websocket.accept()
    try:
        async for event in monitor.stream_anomalies(settings.MONITOR_INTERVAL_SECONDS):
            await websocket.send_text(json.dumps(event))
    except WebSocketDisconnect:
        pass
```

---

## 6. Pydantic Models

### `models/analysis.py`
```python
from pydantic import BaseModel
from typing import Optional

class AnalyzeRequest(BaseModel):
    text: str
    url: Optional[str] = None
    threat_level: Optional[str] = None

class Highlight(BaseModel):
    start: int
    end: int
    type: str
    reason: str
    color: str

class AnalysisResult(BaseModel):
    threat_level: str          # SAFE / SUSPICIOUS / HIGH_RISK
    confidence: int            # 0-100
    tactics: list[str]
    highlights: list[Highlight]
    explanation: str
    url_scan: Optional[dict] = None
```

### `models/score.py`
```python
from pydantic import BaseModel
from typing import Optional

class UserContext(BaseModel):
    score: int
    breaches: list[dict]
    anomalies: list[dict]
    flagged_processes: list[str]

class ChatRequest(BaseModel):
    messages: list[dict]
    context: UserContext

class RecommendRequest(BaseModel):
    email: str
    breaches: list[dict]
    score: int
```

---

## 7. Prompt Builder (`utils/prompt_builder.py`)

```python
def build_phishing_prompt(text: str, flags: list) -> str:
    flag_summary = ", ".join([f['type'] for f in flags]) if flags else "none detected by rules"
    return f"""Analyze this message for phishing/scam intent.

Rule-based flags already found: {flag_summary}

Message to analyze:
---
{text[:2000]}
---

Return JSON only:
{{
  "risk_score": 0-100,
  "tactics": ["list of tactics e.g. Urgency, OTP Harvesting, Authority Impersonation"],
  "explanation": "plain language explanation under 150 words",
  "suspicious_spans": []
}}"""


def build_coach_system_prompt(ctx: dict) -> str:
    breach_names = [b.get('name', 'Unknown') for b in ctx.get('breaches', [])]
    return f"""You are CyberGuard AI, a personal cybersecurity expert assistant.

Current user security status:
- Security Score: {ctx.get('score', 'Unknown')}/100
- Data breaches found: {', '.join(breach_names) or 'None detected'}
- Active system anomalies: {ctx.get('anomaly_count', 0)}
- Flagged processes: {', '.join(ctx.get('flagged_processes', [])) or 'None'}

Instructions:
- Reference the user's ACTUAL data when answering — never give generic advice
- Be concise and specific — give exact steps, not vague recommendations
- Use plain language — no jargon unless explaining it
- If user seems in crisis (hacked, clicked bad link), prioritize immediate action steps
- Running entirely locally — remind user their data never leaves their machine"""


def build_recommend_prompt(email: str, breaches: list, score: int) -> str:
    breach_detail = "\n".join([
        f"- {b['name']} ({b['date']}): {', '.join(b.get('data_exposed', []))}"
        for b in breaches
    ])
    return f"""User email: {email}
Security Score: {score}/100
Breaches found:
{breach_detail or "None"}

Give exactly 5 specific, actionable security recommendations based on these breaches.
Format: numbered list. Each item must take under 5 minutes. Start with most critical."""
```

---

## 8. Known Threats (`utils/known_threats.py`)

```python
import os

# Load bad IP list
with open("data/known_bad_ips.txt") as f:
    BAD_IPS = set(line.strip() for line in f if line.strip())

# Suspicious process names (common malware/spyware names)
SUSPICIOUS_PROCESS_NAMES = {
    "miner", "xmrig", "cryptonight", "coinhive",
    "netcat", "ncat", "nc.exe", "mimikatz",
    "wireshark",  # flag — user should know if this is running
    "nmap", "masscan", "hydra",
}

PHISHING_PATTERNS = [
    {"regex": r"otp|one.time.pass",         "type": "OTP_HARVEST",      "severity": "HIGH",   "reason": "OTP harvesting attempt"},
    {"regex": r"urgent|immediately|asap",   "type": "URGENCY",          "severity": "MEDIUM", "reason": "Urgency manipulation"},
    {"regex": r"your account.*suspend",     "type": "THREAT",           "severity": "HIGH",   "reason": "Account threat"},
    {"regex": r"verify.*identity|kyc",      "type": "IDENTITY_HARVEST", "severity": "HIGH",   "reason": "Identity harvesting"},
    {"regex": r"click here|click the link", "type": "LINK_BAIT",        "severity": "MEDIUM", "reason": "Link baiting"},
    {"regex": r"rbi|sbi|hdfc|icici.*offi",  "type": "IMPERSONATION",    "severity": "HIGH",   "reason": "Bank impersonation"},
    {"regex": r"won|lottery|prize|reward",  "type": "ADVANCE_FEE",      "severity": "HIGH",   "reason": "Advance fee scam"},
    {"regex": r"password.*expire",          "type": "CREDENTIAL_STEAL", "severity": "HIGH",   "reason": "Credential phishing"},
]

def is_bad_ip(ip: str) -> bool:
    return ip in BAD_IPS

def is_suspicious_process(name: str) -> bool:
    return any(s in name.lower() for s in SUSPICIOUS_PROCESS_NAMES)
```

---

## 9. Running the Full Stack

```bash
# Terminal 1 — Start LM Studio
# Open LM Studio → Load mistral-7b-instruct → Start Local Server on :1234

# Terminal 2 — Backend
cd cyberguard-backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Terminal 3 — Frontend
cd cyberguard-frontend
npm install
npm run dev                    # Runs on :5173

# Terminal 4 — ngrok (for demo sharing)
ngrok http 5173
```

---

## 10. API Summary Table

| Method | Endpoint                  | Frontend Page       | Description                        |
|--------|---------------------------|---------------------|------------------------------------|
| POST   | /api/v1/breach/check      | Page 4 — Breach     | Check email in HIBP                |
| GET    | /api/v1/breach/score      | Page 1 — Dashboard  | Get security score                 |
| POST   | /api/v1/analyze/text      | Page 2 — Analyzer   | Analyze text for phishing          |
| POST   | /api/v1/analyze/stream    | Page 2 — Analyzer   | Stream AI explanation (SSE)        |
| GET    | /api/v1/monitor/processes | Page 3 — Monitor    | Get all processes with risk        |
| GET    | /api/v1/monitor/network   | Page 3 — Monitor    | Get network connections + geo      |
| GET    | /api/v1/monitor/metrics   | Page 1 + Page 3     | CPU, RAM, disk, network stats      |
| POST   | /api/v1/ai/chat           | Page 5 — Coach      | Streaming chat with context (SSE)  |
| POST   | /api/v1/ai/recommend      | Page 4 — Breach     | Stream personalized recommendations|
| WS     | /ws/monitor               | Page 1 — Dashboard  | Real-time anomaly event stream     |

---

## 11. LM Studio Setup Checklist

```
□ Download LM Studio from lmstudio.ai
□ Search and download: "mistral-7b-instruct-v0.3" (GGUF Q4_K_M — ~4.3GB)
  OR "llama-3.1-8b-instruct" (GGUF Q4_K_M — ~4.9GB) if RAM > 12GB
□ Load model → Click "Local Server" tab
□ Start server on port 1234
□ Verify: curl http://localhost:1234/v1/models
□ Set LM_STUDIO_MODEL in .env to match loaded model name
```

---

*End of Backend PRD — implements all data contracts defined in FRONTEND_PRD.md*
