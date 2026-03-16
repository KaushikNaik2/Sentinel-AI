"""
Sentinel-AI — Monitor Pydantic Models
Schemas for system monitoring endpoints.
"""

from pydantic import BaseModel
from typing import Optional


class ProcessInfo(BaseModel):
    pid: int
    name: str
    cpu: float
    ram: float
    status: str
    risk: str  # SAFE | SUSPICIOUS | HIGH_RISK
    connections: int


class NetworkConnection(BaseModel):
    local_port: int
    remote_ip: str
    remote_port: int
    status: str
    country: str = "Unknown"
    city: str = ""
    flag: str = "🌐"
    is_bad: bool = False
    pid: Optional[int] = None


class SystemMetrics(BaseModel):
    cpu_percent: float
    ram_percent: float
    ram_used_gb: float
    disk_percent: float
    net_sent_mb: float
    net_recv_mb: float
    process_count: int
    timestamp: str


class AnomalyEvent(BaseModel):
    type: str  # CPU_SPIKE | SUSPICIOUS_PROCESS | BAD_IP_CONNECTION
    severity: str  # LOW | MEDIUM | HIGH | CRITICAL
    message: str
    timestamp: str
    data: Optional[dict] = None
