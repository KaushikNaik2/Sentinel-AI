# Sentinel-AI

Sentinel-AI is a comprehensive security and monitoring systems dashboard featuring system telemetry and an AI-driven attack simulation engine.

## Project Structure

- **frontend/**: Next.js dashboard for real-time visualization. (Owned by Person 1 & Person 2)
- **backend/**: Python-based API and telemetry monitoring service. (Owned by Person 3 & Person 4)
  - **ai_engine/**: Proprietary LLM-driven attack logic. (Owned by Person 4)

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.10+
- LM Studio (for AI Engine)

### Installation

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/scripts/activate # Windows: .\venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
