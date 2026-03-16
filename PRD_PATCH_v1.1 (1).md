# CyberGuard AI — PRD Patch v1.1
**Patches**: 3 gap fixes identified in PS narrative audit  
**Applies to**: FRONTEND_PRD.md + BACKEND_PRD.md  
**Time cost**: ~75 mins total across team

---

## PATCH 1 — Dashboard Page 1: Stats Banner
**File**: `FRONTEND_PRD.md` → PAGE 1: Dashboard  
**Insert**: After TopBar, before the score/stat cards row  
**Time**: 10 mins (frontend only, no backend needed)

---

### NEW COMPONENT: `StatsBanner.jsx`

**Purpose**: Ground the demo in the problem. Judges already read these numbers in the PS — seeing them live in your app creates instant emotional resonance before they even interact with anything.

#### Layout
```
┌─────────────────────────────────────────────────────────────┐
│  ⚠  The threat is real and it's growing fast                │
│  ─────────────────────────────────────────────────────────  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────┐  │
│  │    4,000%        │  │      83%        │  │    88%     │  │
│  │ surge in phishing│  │ emails AI-made  │  │human error │  │
│  │  since AI tools  │  │ indistinguishable│  │causes breach│ │
│  └─────────────────┘  └─────────────────┘  └────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

#### Component Spec
```jsx
// components/dashboard/StatsBanner.jsx

const stats = [
  {
    value:    "4,000%",
    label:    "surge in phishing attacks",
    sublabel: "since AI tools became widely available",
    color:    "accent-red",
  },
  {
    value:    "83%",
    label:    "of phishing emails are AI-generated",
    sublabel: "old advice — 'check for bad grammar' — no longer works",
    color:    "accent-orange",
  },
  {
    value:    "88%",
    label:    "of breaches caused by human error",
    sublabel: "not broken systems — people with no guide",
    color:    "accent-orange",
  },
  {
    value:    "11s",
    label:    "a small business is attacked",
    sublabel: "every 11 seconds. avg loss: $120,000",
    color:    "accent-red",
  },
]
```

#### Visual Rules
- Banner background: `#0f1629` with `border: 1px solid rgba(255,59,92,0.2)` — subtle red tint signals threat
- Left edge: `border-left: 3px solid var(--accent-red)` 
- Stat value: `font-size: 32px`, `font-weight: 500`, color matches `color` field above
- Label: `font-size: 13px`, `color: var(--text-secondary)`
- Sublabel: `font-size: 11px`, `color: var(--text-tertiary)`, italic
- Animate values counting up on page load (0 → final value, 1.2s ease-out)
- Dismissible: small `×` in top right, collapses with smooth height transition
- Collapsed state persists in `localStorage` — don't re-show on every navigate

#### Placement in Dashboard layout
```
TopBar
StatsBanner          ← INSERT HERE
[Score] [Threats] [Breaches]   ← stat cards row (existing)
AnomalyFeed + RiskBreakdown    ← existing
NetworkConnections             ← existing
```

---

## PATCH 2 — Analyzer Page 2: Tactics Breakdown + "Why It Looks Real"
**File**: `FRONTEND_PRD.md` → PAGE 2: Phishing Analyzer  
**Replace**: existing ThreatDetails Panel spec entirely  
**Time**: 20 mins frontend + 10 mins backend prompt tweak

---

### UPDATED COMPONENT: `ThreatDetails.jsx` (full replacement)

```
┌───────────────────────────────────────────────┐
│  ██ THREAT LEVEL: HIGH RISK   Confidence: 94% │
│  ─────────────────────────────────────────── │
│  PSYCHOLOGICAL TACTICS USED (3)               │
│  ┌─────────────────────────────────────────┐  │
│  │ 🔴 AUTHORITY IMPERSONATION              │  │
│  │ Poses as RBI/SBI to trigger compliance. │  │
│  │ Real banks never ask for OTP via SMS.   │  │
│  ├─────────────────────────────────────────┤  │
│  │ 🟠 URGENCY MANIPULATION                 │  │
│  │ "Account suspended in 24 hours" forces  │  │
│  │ panic — bypasses rational thinking.     │  │
│  ├─────────────────────────────────────────┤  │
│  │ 🟠 FEAR INDUCTION                       │  │
│  │ Threat of financial loss activates      │  │
│  │ fight-or-flight. You click before       │  │
│  │ you think.                              │  │
│  └─────────────────────────────────────────┘  │
│                                               │
│  WHY THIS LOOKS REAL                          │
│  ┌─────────────────────────────────────────┐  │
│  │ [streaming AI explanation...]           │  │
│  │ "This email is convincing because it    │  │
│  │  uses your bank's exact logo format,    │  │
│  │  references a plausible transaction     │  │
│  │  amount, and the sender domain differs  │  │
│  │  by only one character from the real    │  │
│  │  bank domain..."                        │  │
│  └─────────────────────────────────────────┘  │
│                                               │
│  URL SCAN   VirusTotal: 12/72 ✗ MALICIOUS    │
│  ─────────────────────────────────────────── │
│  ● LOCAL AI  mistral-7b  ░░░░░░░░ streaming  │
└───────────────────────────────────────────────┘
```

#### Tactics Catalog (render from LLM response)

Each tactic gets a card with: icon color + name + plain-language explanation + "what to do" tip.

```js
// utils/tacticsMeta.js — frontend
export const TACTICS_META = {
  AUTHORITY_IMPERSONATION: {
    icon:    "🔴",
    color:   "accent-red",
    name:    "Authority Impersonation",
    tip:     "Real banks, RBI, and government bodies never ask for OTP, PIN, or passwords via message or call.",
  },
  URGENCY_MANIPULATION: {
    icon:    "🟠",
    color:   "accent-orange",
    name:    "Urgency Manipulation",
    tip:     "Artificial deadlines are designed to stop you thinking. Slow down — real emergencies have official channels.",
  },
  FEAR_INDUCTION: {
    icon:    "🟠",
    color:   "accent-orange",
    name:    "Fear Induction",
    tip:     "Threat of losing money or access triggers panic response. Take 60 seconds before clicking anything.",
  },
  OTP_HARVESTING: {
    icon:    "🔴",
    color:   "accent-red",
    name:    "OTP Harvesting",
    tip:     "No legitimate service needs your OTP. If someone asks for it — it is a scam, 100% of the time.",
  },
  SOCIAL_PROOF: {
    icon:    "🟡",
    color:   "accent-yellow",
    name:    "False Social Proof",
    tip:     "Claims like 'other customers have verified' or 'as per RBI guidelines' are fabricated to seem legitimate.",
  },
  SCARCITY: {
    icon:    "🟡",
    color:   "accent-yellow",
    name:    "Scarcity / Limited Time",
    tip:     "Real offers don't disappear in 2 hours. Artificial scarcity is a classic manipulation pattern.",
  },
  PERSONALIZATION: {
    icon:    "🔴",
    color:   "accent-red",
    name:    "AI Personalization",
    tip:     "AI scraped your public data to craft this. Your name, bank, and recent activity can all be found online.",
  },
}
```

#### "Why This Looks Real" Section

- Appears below tactics — always present when threat level is SUSPICIOUS or HIGH_RISK
- Streams from `/api/v1/analyze/stream-why` endpoint (new — see Backend Patch 2)
- Heading: `WHY THIS LOOKS REAL` in `var(--accent-orange)`, small caps
- Body: streaming typewriter text, monospace font for quoted phrases from the analyzed email
- This is the single most educational moment in the app — tone should be calm + explanatory, not alarmist

#### Updated Prompt for LLM — phishing analysis
```python
# utils/prompt_builder.py — REPLACE build_phishing_prompt

def build_phishing_prompt(text: str, flags: list) -> str:
    flag_summary = ", ".join([f['type'] for f in flags]) if flags else "none"
    return f"""You are a cybersecurity expert analyzing a message for phishing/scam intent.

Rule-based flags found: {flag_summary}

Message:
---
{text[:2000]}
---

Return ONLY valid JSON, no other text:
{{
  "risk_score": 0-100,
  "tactics": [
    {{
      "type": "AUTHORITY_IMPERSONATION | URGENCY_MANIPULATION | FEAR_INDUCTION | OTP_HARVESTING | SOCIAL_PROOF | SCARCITY | PERSONALIZATION",
      "severity": "HIGH | MEDIUM | LOW",
      "evidence": "exact quote or phrase from the message that shows this tactic",
      "explanation": "one sentence plain-language explanation of how this tactic works psychologically"
    }}
  ],
  "why_looks_real": "2-3 sentences explaining specifically what makes this convincing to a normal person — reference actual elements from the message",
  "ai_generated_likelihood": 0-100,
  "summary": "one sentence verdict"
}}"""
```

#### New Backend Endpoint
```python
# routes/analyzer.py — ADD this endpoint

@router.post("/stream-why")
async def stream_why_real(req: AnalyzeRequest):
    """Streams the 'why this looks real' explanation for the tactics panel."""
    messages = [
        {"role": "system", "content": (
            "You are a cybersecurity educator. Explain in plain language "
            "why a phishing message is convincing to ordinary people. "
            "Reference specific elements. Be empathetic — people get fooled "
            "by these because they are designed by AI to fool them. "
            "Under 120 words. No bullet points — flowing prose."
        )},
        {"role": "user", "content": (
            f"Explain why this message looks real and what makes it "
            f"psychologically convincing:\n\n{req.text[:1500]}"
        )}
    ]
    async def generator():
        async for chunk in lm_client.stream(messages):
            yield f"data: {chunk}\n\n"
        yield "data: [DONE]\n\n"
    return StreamingResponse(generator(), media_type="text/event-stream")
```

---

## PATCH 3 — New Page 6: Attack Simulator (`/simulator`)
**File**: `FRONTEND_PRD.md` — ADD as new page section  
**File**: `BACKEND_PRD.md` — ADD new route + service  
**Time**: 45 mins (25 frontend + 20 backend)

---

### NEW PAGE: Attack Simulator (`/simulator`)

**Purpose**: Train users to spot phishing by generating realistic fake attacks against them. Directly addresses "88% of breaches caused by human error" — training beats lecturing.

#### Add to Sidebar nav
```js
{ icon: TargetIcon, label: "Attack Simulator", path: "/simulator", badge: { text: "TRAIN", type: "info" } }
```

#### Full Page Layout
```
┌──────────────────────────────────────────────────────────────┐
│  Attack Simulator                                            │
│  Train your instincts. Spot the fake before it's too late.  │
│  ──────────────────────────────────────────────────────────  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  STEP 1 — ABOUT YOU (personalizes the attack)          │  │
│  │  Your name: [_______]   Your bank: [_______]           │  │
│  │  Your role: [_______]   Difficulty: [Easy/Med/Hard]    │  │
│  │                                                        │  │
│  │  Attack type: [● Email]  [○ SMS]  [○ WhatsApp]         │  │
│  │                                                        │  │
│  │            [GENERATE ATTACK  ▶]                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  STEP 2 — THE ATTACK (looks like real email client)    │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │ From: alerts@sbi-secure-verify.net               │  │  │
│  │  │ To:   [user's name]                              │  │  │
│  │  │ Sub:  Urgent: Verify your SBI account            │  │  │
│  │  │ ──────────────────────────────────────────────── │  │  │
│  │  │ Dear [Name],                                     │  │  │
│  │  │ We have detected unusual activity...             │  │  │
│  │  │ [realistic AI-generated phishing body]           │  │  │
│  │  │                                                  │  │  │
│  │  │        [VERIFY NOW]   ← fake CTA button          │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                                                        │  │
│  │  How many red flags can you spot?                      │  │
│  │  [FLAG 1] [FLAG 2] [FLAG 3] [FLAG 4]  ← user clicks   │  │
│  │                                                        │  │
│  │          [SUBMIT MY ANSWERS  →]                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  STEP 3 — YOUR SCORE                                   │  │
│  │  You spotted 4 of 6 red flags  ████████░░  67%         │  │
│  │                                                        │  │
│  │  ✓ Caught: Suspicious sender domain                    │  │
│  │  ✓ Caught: Urgency language                            │  │
│  │  ✗ Missed: Subtle logo mismatch                        │  │
│  │  ✗ Missed: Generic greeting despite "knowing" your name│  │
│  │                                                        │  │
│  │  Security Score:  +8 points  →  Now: 61/100            │  │
│  │                                                        │  │
│  │  [TRY HARDER ATTACK]      [SHARE RESULT]               │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

#### Component Breakdown

**SetupForm**
- Inputs: name, bank/org name, job role — personalizes the generated attack
- Difficulty: Easy (obvious flags) → Medium (subtle) → Hard (near-perfect AI)
- Attack type: Email / SMS / WhatsApp — renders different UI shell in Step 2
- All stored in local component state, sent to backend on submit

**EmailShell** (renders the fake attack)
- Styled to look like a real email client: Gmail-like header, sender avatar, subject line
- Body rendered from LLM response — monospace body text
- Fake CTA button styled identically to real bank buttons — red or green, looks legitimate
- No actual links — button click just logs as "would have clicked"
- Difficulty = Hard adds: correct bank logo, real-looking domain typosquat, personalized transaction detail

**RedFlagSelector**
- User sees the email and taps/clicks to highlight what they think are red flags
- Each click creates a colored highlight overlay on the email text
- Minimum 1 selection required before submitting
- Instruction: "Tap any part of the email you think is suspicious"

**ScoreReveal** (animated, satisfying)
- Progress bar animates to final score
- Each flag revealed one by one with green ✓ (caught) or red ✗ (missed)
- Missed flags highlighted in the email with explanation
- Security Score delta: `+N points` animates in real time via score store
- Difficulty unlocks: score ≥ 80% on Medium → Hard difficulty unlocks

---

### NEW BACKEND: Simulator Service

#### New file: `services/attack_simulator.py`

```python
from app.services.lmstudio import lm_client
from app.utils.prompt_builder import build_attack_prompt, build_scoring_prompt
import json

class AttackSimulator:

    async def generate_attack(self,
                               name: str,
                               bank: str,
                               role: str,
                               difficulty: str,
                               attack_type: str) -> dict:
        """Generate a realistic fake phishing attack personalized to the user."""

        prompt = build_attack_prompt(name, bank, role, difficulty, attack_type)
        messages = [
            {"role": "system", "content": (
                "You are a cybersecurity trainer generating FAKE phishing examples "
                "for educational simulation. These are never sent — they are shown "
                "to users in a controlled training environment to teach them to "
                "spot scams. Generate realistic but fake phishing content only. "
                "Return ONLY valid JSON."
            )},
            {"role": "user", "content": prompt}
        ]

        raw = await lm_client.complete(messages, temperature=0.7)
        return self._parse_attack(raw)

    async def score_attempt(self,
                             attack: dict,
                             user_flags: list[dict]) -> dict:
        """Score the user's red flag selections against ground truth."""

        prompt = build_scoring_prompt(attack, user_flags)
        messages = [
            {"role": "system", "content": (
                "You are a cybersecurity trainer scoring a phishing awareness exercise. "
                "Compare what the user flagged vs the actual red flags. "
                "Be encouraging but honest. Return ONLY valid JSON."
            )},
            {"role": "user", "content": prompt}
        ]

        raw = await lm_client.complete(messages, temperature=0.1)
        result = self._parse_score(raw)
        result['score_delta'] = self._calculate_score_delta(
            result['caught'], result['total_flags']
        )
        return result

    def _calculate_score_delta(self, caught: int, total: int) -> int:
        ratio = caught / max(total, 1)
        if ratio >= 0.8:  return 12
        if ratio >= 0.6:  return 6
        if ratio >= 0.4:  return 3
        return 0

    def _parse_attack(self, raw: str) -> dict:
        try:
            s, e = raw.find('{'), raw.rfind('}') + 1
            return json.loads(raw[s:e])
        except Exception:
            return {"error": "generation failed", "raw": raw[:300]}

    def _parse_score(self, raw: str) -> dict:
        try:
            s, e = raw.find('{'), raw.rfind('}') + 1
            return json.loads(raw[s:e])
        except Exception:
            return {"caught": 0, "total_flags": 1, "feedback": []}

simulator = AttackSimulator()
```

#### New Prompt Templates — add to `utils/prompt_builder.py`

```python
def build_attack_prompt(name: str, bank: str, role: str,
                         difficulty: str, attack_type: str) -> str:
    difficulty_guide = {
        "easy":   "Include obvious red flags: bad grammar, clearly wrong domain, generic greeting",
        "medium": "Subtle red flags: one typosquat domain, mild urgency, mostly correct format",
        "hard":   "Near-perfect: correct logo description, real domain typosquat (e.g. sbi-alerts.net vs sbi.co.in), personalized details, professional tone",
    }
    return f"""Generate a FAKE phishing {attack_type} for cybersecurity training.

Target profile:
- Name: {name}
- Bank/Organization: {bank}
- Role: {role}
- Difficulty: {difficulty} — {difficulty_guide.get(difficulty, '')}

Return JSON only:
{{
  "sender_name":    "display name attacker uses",
  "sender_email":   "fake email address (typosquat or suspicious domain)",
  "subject":        "email subject line",
  "body":           "full email body with greeting, content, CTA",
  "cta_text":       "text on the fake button e.g. Verify Now",
  "red_flags": [
    {{
      "id":          "flag_1",
      "type":        "SENDER_DOMAIN | URGENCY | GRAMMAR | GENERIC_GREETING | LINK_MISMATCH | REQUEST_TYPE | LOGO | PERSONALIZATION",
      "location":    "sender | subject | body | cta",
      "description": "exact explanation of why this is a red flag",
      "quote":       "the exact text or element that is suspicious"
    }}
  ],
  "difficulty":     "{difficulty}",
  "attack_type":    "{attack_type}"
}}"""


def build_scoring_prompt(attack: dict, user_flags: list) -> str:
    actual = json.dumps(attack.get('red_flags', []), indent=2)
    user   = json.dumps(user_flags, indent=2)
    return f"""Score this phishing awareness training attempt.

Actual red flags in the fake phishing message:
{actual}

What the user flagged as suspicious:
{user}

Return JSON only:
{{
  "caught": <number of actual flags the user correctly identified>,
  "missed": <number of actual flags the user missed>,
  "total_flags": <total actual flags>,
  "false_positives": <things user flagged that were not actually red flags>,
  "feedback": [
    {{
      "flag_id":  "from actual red flags list",
      "caught":   true/false,
      "message":  "educational explanation — why this was a red flag and what to look for next time"
    }}
  ],
  "overall_tip": "one personalized sentence of encouragement and the most important lesson from this attempt"
}}"""
```

#### New Route — add to `routes/`

```python
# routes/simulator.py
from fastapi import APIRouter
from app.services.attack_simulator import simulator
from pydantic import BaseModel

router = APIRouter()

class GenerateRequest(BaseModel):
    name:        str
    bank:        str
    role:        str = "individual"
    difficulty:  str = "medium"
    attack_type: str = "email"

class ScoreRequest(BaseModel):
    attack:      dict
    user_flags:  list[dict]

@router.post("/generate")
async def generate_attack(req: GenerateRequest):
    return await simulator.generate_attack(
        req.name, req.bank, req.role, req.difficulty, req.attack_type
    )

@router.post("/score")
async def score_attempt(req: ScoreRequest):
    return await simulator.score_attempt(req.attack, req.user_flags)
```

#### Register in `main.py` — add one line
```python
from app.api.routes import simulator          # add this import
app.include_router(simulator.router, prefix="/api/v1/simulator", tags=["Simulator"])
```

---

## Updated API Summary — add these rows to Backend PRD table

| Method | Endpoint                      | Frontend Page        | Description                             |
|--------|-------------------------------|----------------------|-----------------------------------------|
| POST   | /api/v1/analyze/stream-why    | Page 2 — Analyzer    | Stream "why this looks real" explanation|
| POST   | /api/v1/simulator/generate    | Page 6 — Simulator   | Generate personalized fake phishing     |
| POST   | /api/v1/simulator/score       | Page 6 — Simulator   | Score user's red flag selections        |

---

## Updated Security Score Formula — patch `services/score_engine.py`

```python
# ADD this param to calculate() signature and logic:
def calculate(self, breaches, anomaly_count, flagged_processes,
              bad_connections, training_score=0) -> dict:

    # ... existing deductions ...

    # Training bonus — reward users who practice
    training_bonus = min(int(training_score * 0.15), 15)  # max +15 from training
    score = min(score + training_bonus, 100)

    return {
        "score":    score,
        "grade":    self._grade(score),
        "label":    self._label(score),
        "breakdown": {
            # ... existing ...
            "training_bonus": training_bonus,
        }
    }
```

---

## Patch Summary

| Patch | Where | What changes | Time |
|-------|-------|-------------|------|
| 1 — Stats Banner    | Dashboard Page 1      | New `StatsBanner` component above score cards | 10 min |
| 2 — Tactics Panel   | Analyzer Page 2       | Replace ThreatDetails + new stream-why endpoint + updated prompt | 30 min |
| 3 — Simulator       | New Page 6 + backend  | Full page + simulator service + 2 new endpoints | 45 min |
| Score formula patch | `score_engine.py`     | Add training bonus param | 5 min |

**Total: ~90 mins. Assign Patch 1+2 to Person 3 (frontend). Patch 3 split: Person 2 does backend service, Person 3 does the page UI.**

---

*End of PRD Patch v1.1 — apply on top of FRONTEND_PRD.md and BACKEND_PRD.md*
