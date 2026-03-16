# SentinelAI — Frontend PRD
**Product**: AI-Powered Personal Cybersecurity Coaching Agent  
**Version**: 1.0 — Hackathon MVP  
**Stack**: React 18 + Vite + TailwindCSS + Recharts + Socket.IO client  
**Theme**: Dark cybersecurity dashboard — privacy-first, local-first

---

## 1. Design System

### 1.1 Color Palette

```css
/* globals.css */
:root {
  --bg-primary:     #0a0e1a;   /* Main page background — deep navy black */
  --bg-secondary:   #0f1629;   /* Card/panel background */
  --bg-tertiary:    #1a2235;   /* Elevated surface, input bg */
  --bg-hover:       #1e2a42;   /* Hover states */

  --accent-green:   #00ff88;   /* Primary CTA, safe status, score high */
  --accent-cyan:    #00d4ff;   /* Info, links, secondary actions */
  --accent-purple:  #7c3aed;   /* AI/model indicator */
  --accent-orange:  #ff6b35;   /* Warning, medium risk */
  --accent-red:     #ff3b5c;   /* Critical, high risk, danger */

  --text-primary:   #e2e8f0;   /* Main text */
  --text-secondary: #94a3b8;   /* Muted text, labels */
  --text-tertiary:  #475569;   /* Disabled, placeholder */

  --border-default: #1e2a42;   /* Card borders */
  --border-accent:  #00ff8830; /* Glowing border on active cards */

  --safe:           #00ff88;
  --suspicious:     #ff6b35;
  --danger:         #ff3b5c;
}
```

### 1.2 Typography

```css
font-family: 'Inter', 'JetBrains Mono', sans-serif;

/* Scale */
--text-xs:   11px;
--text-sm:   13px;
--text-base: 15px;
--text-lg:   18px;
--text-xl:   24px;
--text-2xl:  32px;

/* Mono for code/IPs/hashes */
font-family: 'JetBrains Mono', 'Fira Code', monospace; /* for technical values */
```

### 1.3 Component Tokens

```
Border radius:   8px (cards), 6px (buttons), 4px (badges), 9999px (pills)
Box shadow:      0 0 20px rgba(0,255,136,0.08)  — green glow on focus/active
Card border:     1px solid #1e2a42
Active card:     1px solid rgba(0,255,136,0.3) + subtle glow
Transition:      all 0.15s ease
```

### 1.4 Status Badge System

| Status       | Background       | Text       | Border              |
|--------------|------------------|------------|---------------------|
| SAFE         | #00ff8815        | #00ff88    | 1px solid #00ff8840 |
| SUSPICIOUS   | #ff6b3515        | #ff6b35    | 1px solid #ff6b3540 |
| HIGH RISK    | #ff3b5c15        | #ff3b5c    | 1px solid #ff3b5c40 |
| MONITORING   | #00d4ff15        | #00d4ff    | 1px solid #00d4ff40 |
| LOCAL AI     | #7c3aed15        | #a78bfa    | 1px solid #7c3aed40 |

---

## 2. Application Structure

```
src/
├── main.jsx
├── App.jsx                    # Router + layout wrapper
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx        # Left nav
│   │   ├── TopBar.jsx         # Status bar with local model indicator
│   │   └── Layout.jsx         # Page shell
│   ├── ui/
│   │   ├── ScoreGauge.jsx     # Circular security score
│   │   ├── ThreatBadge.jsx    # SAFE / SUSPICIOUS / HIGH RISK pill
│   │   ├── LiveDot.jsx        # Pulsing green dot for live feeds
│   │   ├── CodeBlock.jsx      # Monospace highlighted output
│   │   ├── StatCard.jsx       # Metric card with icon
│   │   └── StreamingText.jsx  # Typewriter AI response
│   ├── dashboard/
│   │   ├── SecurityScoreCard.jsx
│   │   ├── AnomalyFeed.jsx
│   │   ├── NetworkMap.jsx
│   │   └── RiskBreakdown.jsx
│   ├── analyzer/
│   │   ├── TextInput.jsx
│   │   ├── ResultHighlighter.jsx
│   │   └── ThreatDetails.jsx
│   ├── monitor/
│   │   ├── ProcessList.jsx
│   │   ├── NetworkConnections.jsx
│   │   └── MetricsChart.jsx
│   └── chat/
│       ├── ChatWindow.jsx
│       ├── MessageBubble.jsx
│       └── SuggestedQuestions.jsx
├── pages/
│   ├── Dashboard.jsx          # Page 1 — Main overview
│   ├── Analyzer.jsx           # Page 2 — Phishing/email analyzer
│   ├── Monitor.jsx            # Page 3 — Live system monitor
│   ├── BreachCheck.jsx        # Page 4 — Personal risk profile
│   └── Coach.jsx              # Page 5 — AI chatbot
├── hooks/
│   ├── useWebSocket.js        # Real-time system feed
│   ├── useOllama.js           # Stream LLM responses
│   └── useSecurityScore.js    # Score calculation logic
├── services/
│   ├── api.js                 # Axios base + all endpoint calls
│   ├── ollama.js              # LM Studio fetch wrapper
│   └── socket.js              # Socket.IO connection
└── store/
    └── securityStore.js       # Zustand — global state
```

---

## 3. Pages — Detailed Spec

---

### PAGE 1: Dashboard (`/`)

**Purpose**: Single-glance security overview. The "home base." Judges land here first.

#### Layout
```
┌─────────────────────────────────────────────────────────┐
│ TopBar: "CyberGuard AI"  ●LOCAL MODEL ACTIVE  [email]   │
├──────────┬──────────────────────────────────────────────┤
│          │  ┌──────────┐  ┌────────┐  ┌────────┐       │
│ Sidebar  │  │  SCORE   │  │Threats │  │Breaches│       │
│          │  │  GAUGE   │  │  (n)   │  │  (n)   │       │
│ Dashboard│  └──────────┘  └────────┘  └────────┘       │
│ Analyzer │                                               │
│ Monitor  │  ┌──────────────────────┐  ┌──────────────┐  │
│ Breach   │  │  LIVE ANOMALY FEED   │  │ RISK BREAKDOWN│ │
│ Coach    │  │  [WebSocket stream]  │  │  [Pie chart]  │ │
│          │  └──────────────────────┘  └──────────────┘  │
│          │                                               │
│          │  ┌──────────────────────────────────────────┐ │
│          │  │     NETWORK CONNECTIONS (live table)      │ │
│          │  └──────────────────────────────────────────┘ │
└──────────┴──────────────────────────────────────────────┘
```

#### Components

**SecurityScoreCard**
- Large circular gauge (SVG), 0–100
- Color: red(0–40) → orange(41–70) → green(71–100)
- Animated fill on load (1.5s ease)
- Sub-label: "Your Security Score" + one-line summary

**StatCards (row of 3)**
```
[🔴 Active Threats: 2]   [🟡 Processes Flagged: 5]   [🔵 Breaches Found: 3]
```
- Each clickable → navigates to relevant page
- Number animates up on load

**AnomalyFeed**
- Live scrolling list via WebSocket
- Each entry: `[TIMESTAMP]  [SEVERITY BADGE]  process_name — description`
- Color-coded rows: red bg for HIGH, orange for MED, muted for LOW
- Max 50 entries, auto-scroll to latest
- Empty state: `● Monitoring system... no anomalies detected`

**RiskBreakdown** (Recharts PieChart)
- Categories: Network / Process / Breach / Phishing
- Dark theme: `background: transparent`, custom tooltip
- Legend below chart, custom dot colors

**NetworkConnections** (live table)
- Columns: Process | Remote IP | Port | Country Flag | Status
- Suspicious IPs highlighted in red row
- Refreshes every 3 seconds

---

### PAGE 2: Phishing Analyzer (`/analyzer`)

**Purpose**: Paste any email, message, or URL → get instant AI threat analysis.

#### Layout
```
┌─────────────────────────────────────────────────────────┐
│  Phishing & Scam Analyzer                               │
│  ─────────────────────────────────────────────────────  │
│  ┌─────────────────────────────┐  ┌───────────────────┐ │
│  │  PASTE EMAIL / MESSAGE      │  │  THREAT RESULT    │ │
│  │  [large textarea]           │  │                   │ │
│  │                             │  │  ██ HIGH RISK     │ │
│  │  [URL field]                │  │  Score: 94/100    │ │
│  │                             │  │                   │ │
│  │  [ANALYZE  ▶]               │  │  Red flags (4):   │ │
│  └─────────────────────────────┘  │  • OTP request    │ │
│                                   │  • Urgency lang   │ │
│  ┌─────────────────────────────┐  │  • Fake authority │ │
│  │  HIGHLIGHTED TRANSCRIPT     │  │  • Suspicious URL │ │
│  │  (color-annotated text)     │  └───────────────────┘ │
│  └─────────────────────────────┘                        │
└─────────────────────────────────────────────────────────┘
```

#### Components

**Input Panel**
- `<textarea>` — min 200px height, monospace font, dark bg `#0f1629`, green caret
- URL field below textarea — separate input for link scanning
- `ANALYZE` button — full width, green accent, loading spinner during inference
- Keyboard shortcut: `Ctrl+Enter` to submit

**ResultHighlighter**
- Takes original text + array of `{start, end, type, reason}` spans from backend
- Renders highlighted HTML: red for phishing phrases, orange for urgency, yellow for suspicious patterns
- Hover tooltip on each highlight → shows AI reason

**ThreatDetails Panel**
```
┌────────────────────────────────┐
│  ██ THREAT LEVEL: HIGH RISK    │
│  Confidence: 94%               │
│  ────────────────────────────  │
│  Threat type: Phishing         │
│  Tactics detected:             │
│    🔴 OTP Harvesting           │
│    🔴 Authority Impersonation  │
│    🟡 Urgency Manipulation     │
│    🟡 Fear Induction           │
│  ────────────────────────────  │
│  URL Scan: MALICIOUS ✗         │
│  VirusTotal: 12/72 engines     │
│  ────────────────────────────  │
│  AI Explanation:               │
│  [streaming text from Ollama]  │
└────────────────────────────────┘
```

**AI Explanation** — streaming text display
- Typewriter effect as tokens stream from LM Studio
- `● LOCAL AI` badge in corner — shows it's running offline
- "Why is this dangerous?" framing — educational tone

---

### PAGE 3: System Monitor (`/monitor`)

**Purpose**: Live view of system processes and network activity. Real-time anomaly detection.

#### Layout
```
┌─────────────────────────────────────────────────────────┐
│  Live System Monitor     ● MONITORING ACTIVE            │
│  ─────────────────────────────────────────────────────  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ CPU: 34% │ │RAM: 61% │ │Net: 2MB/s│ │Procs: 142│  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                          │
│  ┌──────────────────────────┐  ┌──────────────────────┐ │
│  │  CPU + RAM CHART (live) │  │  FLAGGED PROCESSES   │ │
│  │  [Recharts LineChart]   │  │  [table]             │ │
│  └──────────────────────────┘  └──────────────────────┘ │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              NETWORK CONNECTIONS                 │   │
│  │  Process | PID | Remote IP | Port | Status | ▼  │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

#### Components

**MetricCards (row of 4)**
- CPU %, RAM %, Network I/O, Process count
- Sparkline mini-chart in each card (last 30 data points)
- Red glow if CPU > 90% or RAM > 85%

**LiveChart** (Recharts LineChart)
- Dual line: CPU (green) + RAM (cyan)
- Rolling 60-second window
- X-axis: timestamps, Y-axis: 0–100%
- Custom tooltip, dark grid lines, no background

**FlaggedProcesses Table**
- Columns: Process | PID | CPU% | RAM | Network | Risk | Action
- Risk badge per row: SAFE / SUSPICIOUS / HIGH RISK
- Suspicious: unknown processes with high network activity
- `[Ask AI]` button per row → opens Coach with context pre-filled

**NetworkConnections Table**
- All active connections from psutil
- Geo-IP lookup for country flag + city
- Known bad IPs highlighted red (via local blacklist)
- Sortable columns

---

### PAGE 4: Breach Check (`/breach`)

**Purpose**: Enter email → get full personal risk profile. The "shock and educate" page.

#### Layout
```
┌─────────────────────────────────────────────────────────┐
│  Personal Security Risk Profile                          │
│  ─────────────────────────────────────────────────────  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Enter your email address:  [input]  [SCAN NOW]   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────┐   ┌──────────────────────────────┐   │
│  │ SCORE: 34/100│   │  BREACHES FOUND (3)          │   │
│  │  ████░░░░░░  │   │  ┌──────────────────────┐   │   │
│  │  POOR        │   │  │ LinkedIn — 2021       │   │   │
│  └──────────────┘   │  │ 117M records exposed  │   │   │
│                     │  │ Email, Password hash  │   │   │
│                     │  ├──────────────────────┤   │   │
│                     │  │ Adobe — 2019  ...     │   │   │
│                     │  └──────────────────────┘   │   │
│                     └──────────────────────────────┘   │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │  AI RECOMMENDATIONS (personalized, streaming)     │  │
│  │  "Based on your exposure, here are your top 5..." │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

#### Components

**EmailInput**
- Large centered input, green border on focus
- `SCAN NOW` button triggers HIBP API call + Ollama analysis
- Loading state: animated scanning bar with "Checking dark web databases..."

**BreachList**
- Each breach: Logo placeholder + Name + Year + Record count + Data types exposed
- Data type chips: `email` `password` `phone` `address` `credit card`
- Severity-coded left border: red for password exposure, orange for email only
- Expandable accordion for breach details

**AIRecommendations**
- Streaming text from Ollama, pre-prompted with breach context
- Format: numbered action list
- Each action has a `[Mark Done]` checkbox → increases security score
- Progress bar: "X of Y actions completed"

**PasswordChecker** (bonus, same page)
- Local strength meter — text never leaves browser
- Common breach password check against local list
- No server call — purely client-side for privacy story

---

### PAGE 5: Security Coach (`/coach`)

**Purpose**: Conversational AI that knows your risk profile. Ask anything about your security.

#### Layout
```
┌─────────────────────────────────────────────────────────┐
│  Security Coach    ● LOCAL AI  ● Context-aware          │
│  ─────────────────────────────────────────────────────  │
│  ┌──────────────────────────────────────────────────┐   │
│  │                                                  │   │
│  │  [AI] Hello! I've analyzed your system. You      │   │
│  │       have 3 breaches and 2 suspicious processes │   │
│  │       running. What would you like to address?   │   │
│  │                                                  │   │
│  │  [YOU] What should I do about the LinkedIn breach│   │
│  │                                                  │   │
│  │  [AI] For the LinkedIn breach from 2021, here    │   │
│  │       are the exact steps: ▌ (streaming...)      │   │
│  │                                                  │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Suggested: [Is this email safe?] [I got hacked] [2FA]  │
│                                                          │
│  ┌────────────────────────────────┐  ┌───────────────┐  │
│  │  Type your question...         │  │  SEND  →      │  │
│  └────────────────────────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────┘
```

#### Components

**ChatWindow**
- Auto-scroll to latest message
- AI messages: left-aligned, dark card bg, `● AI` label with purple dot
- User messages: right-aligned, slightly lighter bg
- Streaming: typewriter cursor `▌` while tokens arrive
- Code blocks in AI responses: monospace, syntax highlighted

**MessageBubble**
- Timestamps on hover
- Copy button on AI messages
- Markdown rendering: bold, lists, code inline

**SuggestedQuestions** (chips, pre-populated)
- "Is this email safe?" → opens with paste prompt
- "What do I do if I clicked a bad link?"
- "How do I set up 2FA?"
- "What were my breaches?"
- "Explain my security score"

**Context System Prompt** (sent to Ollama)
```
You are CyberGuard AI, a personal cybersecurity expert.
User context:
- Security Score: {score}/100
- Breaches: {breaches}
- Flagged processes: {processes}
- Last threat detected: {threat}
Answer in plain language. Be specific. Reference their actual data.
```

---

## 4. Sidebar Navigation

```jsx
const navItems = [
  { icon: ShieldIcon,    label: "Dashboard",   path: "/",         badge: null },
  { icon: SearchIcon,    label: "Analyzer",    path: "/analyzer", badge: null },
  { icon: ActivityIcon,  label: "Monitor",     path: "/monitor",  badge: { count: 2, type: "danger" } },
  { icon: UserIcon,      label: "Breach Check",path: "/breach",   badge: { count: 3, type: "warning" } },
  { icon: BotIcon,       label: "AI Coach",    path: "/coach",    badge: null },
]
```

- Active state: left green border + slightly lighter bg
- Badges: small red/orange pills with count
- Bottom of sidebar: `● LOCAL MODEL ACTIVE` + model name

---

## 5. TopBar

```
┌─────────────────────────────────────────────────────────┐
│  🛡 CyberGuard AI          ● mistral-7b — LOCAL         │
│                            ● System Monitoring Active    │
│                            [user@email.com  ▾]          │
└─────────────────────────────────────────────────────────┘
```

- Left: Logo + product name
- Center: Local model badge (green pulsing dot + model name)
- Right: Active email context + monitoring status

---

## 6. Global State (Zustand)

```js
const useSecurityStore = create((set) => ({
  // User
  email: null,
  setEmail: (email) => set({ email }),

  // Score
  securityScore: 0,
  setScore: (score) => set({ securityScore: score }),

  // Breaches
  breaches: [],
  setBreaches: (breaches) => set({ breaches }),

  // System
  anomalies: [],
  addAnomaly: (a) => set((s) => ({ anomalies: [a, ...s.anomalies].slice(0, 50) })),
  processes: [],
  setProcesses: (p) => set({ processes: p }),
  connections: [],
  setConnections: (c) => set({ connections: c }),

  // Chat
  messages: [],
  addMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
}))
```

---

## 7. Key UX Rules

1. **Every AI response must stream** — no loading spinners for text, use typewriter effect
2. **Real data only** — never show fake/mock breach results to judges
3. **LOCAL AI badge** always visible — this is the differentiator, show it prominently
4. **Clickable everything** — stat cards navigate, process rows open detail, breach cards expand
5. **Dark theme strictly enforced** — no white surfaces, security tools are dark
6. **Mobile not required** — optimize for 1280px+ laptop screen for demo

---

## 8. Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.26.0",
    "recharts": "^2.12.0",
    "socket.io-client": "^4.7.5",
    "zustand": "^4.5.5",
    "axios": "^1.7.7",
    "lucide-react": "^0.441.0",
    "clsx": "^2.1.1"
  },
  "devDependencies": {
    "vite": "^5.4.0",
    "@vitejs/plugin-react": "^4.3.1",
    "tailwindcss": "^3.4.10",
    "autoprefixer": "^10.4.20"
  }
}
```

---

## 9. Vite + Tailwind Config

```js
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: { primary: "#0a0e1a", secondary: "#0f1629", tertiary: "#1a2235" },
        accent: {
          green:  "#00ff88",
          cyan:   "#00d4ff",
          purple: "#7c3aed",
          orange: "#ff6b35",
          red:    "#ff3b5c",
        },
        text: {
          primary:   "#e2e8f0",
          secondary: "#94a3b8",
          tertiary:  "#475569",
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in',
      }
    }
  }
}
```

---

*End of Frontend PRD — reference this for all UI implementation decisions.*
