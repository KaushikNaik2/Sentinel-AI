"""
Sentinel-AI — Anomaly Detector Service
Rule-based + AI-powered anomaly detection for system events.
Works alongside SystemMonitor to identify security threats.
"""

import logging
from datetime import datetime
from app.services.lmstudio import lm_client

logger = logging.getLogger("sentinel-ai.anomaly")


class AnomalyDetector:

    def __init__(self):
        self._anomaly_history: list[dict] = []
        self._max_history = 100

    def detect_anomalies(self, metrics: dict, processes: list, connections: list) -> list[dict]:
        """
        Run rule-based anomaly detection on current system state.
        Returns list of detected anomaly events.
        """
        anomalies = []
        ts = datetime.now().isoformat()

        # CPU spike
        cpu = metrics.get("cpu_percent", 0)
        if cpu > 85:
            anomalies.append({
                "type": "CPU_SPIKE",
                "severity": "HIGH" if cpu > 95 else "MEDIUM",
                "message": f"CPU usage critically high at {cpu}%",
                "timestamp": ts,
            })

        # RAM pressure
        ram = metrics.get("ram_percent", 0)
        if ram > 90:
            anomalies.append({
                "type": "RAM_PRESSURE",
                "severity": "HIGH" if ram > 95 else "MEDIUM",
                "message": f"RAM usage at {ram}%",
                "timestamp": ts,
            })

        # Excessive connections
        conn_count = len(connections)
        if conn_count > 50:
            anomalies.append({
                "type": "EXCESSIVE_CONNECTIONS",
                "severity": "MEDIUM",
                "message": f"{conn_count} active network connections detected",
                "timestamp": ts,
            })

        # Suspicious processes
        for p in processes:
            if p.get("risk") == "HIGH_RISK":
                anomalies.append({
                    "type": "SUSPICIOUS_PROCESS",
                    "severity": "HIGH",
                    "message": f"Suspicious process detected: {p['name']} (PID {p['pid']})",
                    "timestamp": ts,
                    "data": p,
                })

        # Bad IP connections
        for conn in connections:
            if conn.get("is_bad"):
                anomalies.append({
                    "type": "BAD_IP_CONNECTION",
                    "severity": "CRITICAL",
                    "message": f"Connection to known malicious IP: {conn['remote_ip']}",
                    "timestamp": ts,
                    "data": conn,
                })

        # Store in history
        for a in anomalies:
            self._anomaly_history.append(a)
        # Trim history
        if len(self._anomaly_history) > self._max_history:
            self._anomaly_history = self._anomaly_history[-self._max_history:]

        return anomalies

    async def ai_analyze_anomaly(self, anomaly: dict) -> str:
        """Use LLM to provide deeper analysis of a detected anomaly."""
        messages = [
            {"role": "system", "content": (
                "You are a cybersecurity incident analyst. "
                "Analyze the following system anomaly and provide: "
                "1) What it likely means, 2) Immediate risk level, 3) Recommended action. "
                "Be concise — under 100 words."
            )},
            {"role": "user", "content": (
                f"Anomaly detected:\n"
                f"Type: {anomaly.get('type')}\n"
                f"Severity: {anomaly.get('severity')}\n"
                f"Details: {anomaly.get('message')}\n"
                f"Data: {str(anomaly.get('data', {}))[:500]}"
            )}
        ]
        return await lm_client.complete(messages, temperature=0.2)

    def get_history(self) -> list[dict]:
        """Return recent anomaly history."""
        return list(reversed(self._anomaly_history))

    @property
    def anomaly_count(self) -> int:
        return len(self._anomaly_history)


anomaly_detector = AnomalyDetector()
