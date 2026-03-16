"""
Sentinel-AI — System Monitor Service
psutil-based real-time system monitoring with anomaly detection.
Provides process listing, network connections, and system metrics.
"""

import psutil
import asyncio
import logging
from datetime import datetime
from typing import AsyncGenerator
from app.utils.ip_lookup import get_ip_info
from app.utils.known_threats import is_suspicious_process, is_bad_ip

logger = logging.getLogger("sentinel-ai.monitor")


class SystemMonitor:

    def get_processes(self) -> list[dict]:
        """Returns running processes with security risk assessment."""
        processes = []
        for proc in psutil.process_iter(
            ['pid', 'name', 'cpu_percent', 'memory_percent', 'connections', 'status']
        ):
            try:
                info = proc.info
                risk = self._assess_process_risk(info)
                processes.append({
                    "pid":         info['pid'],
                    "name":        info['name'] or "unknown",
                    "cpu":         round(info.get('cpu_percent', 0) or 0, 1),
                    "ram":         round(info.get('memory_percent', 0) or 0, 1),
                    "status":      info.get('status', 'unknown'),
                    "risk":        risk,
                    "connections": len(info.get('connections') or []),
                })
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                continue
            except Exception as e:
                logger.debug("Error reading process: %s", e)
                continue
        return sorted(processes, key=lambda x: x['cpu'], reverse=True)[:50]

    def get_network_connections(self) -> list[dict]:
        """Returns active network connections with geo-IP enrichment."""
        connections = []
        try:
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
        except (psutil.AccessDenied, PermissionError):
            logger.warning("Insufficient permissions to read network connections")
        except Exception as e:
            logger.error("Error reading network connections: %s", e)
        return connections

    def get_metrics(self) -> dict:
        """Returns current system resource utilization metrics."""
        try:
            net = psutil.net_io_counters()
            return {
                "cpu_percent":   psutil.cpu_percent(interval=0.1),
                "ram_percent":   psutil.virtual_memory().percent,
                "ram_used_gb":   round(psutil.virtual_memory().used / 1e9, 1),
                "disk_percent":  psutil.disk_usage('/').percent,
                "net_sent_mb":   round(net.bytes_sent / 1e6, 1),
                "net_recv_mb":   round(net.bytes_recv / 1e6, 1),
                "process_count": len(psutil.pids()),
                "timestamp":     datetime.now().isoformat(),
            }
        except Exception as e:
            logger.error("Error reading system metrics: %s", e)
            return {
                "cpu_percent": 0, "ram_percent": 0, "ram_used_gb": 0,
                "disk_percent": 0, "net_sent_mb": 0, "net_recv_mb": 0,
                "process_count": 0, "timestamp": datetime.now().isoformat(),
            }

    def _assess_process_risk(self, info: dict) -> str:
        """Rule-based security risk assessment for a process."""
        name = (info.get('name') or '').lower()
        conns = len(info.get('connections') or [])
        cpu = info.get('cpu_percent', 0) or 0

        if is_suspicious_process(name):
            return "HIGH_RISK"
        if conns > 20 or (cpu > 80 and name not in (
            'chrome', 'firefox', 'code', 'electron', 'node', 'python',
            'java', 'cargo', 'rustc', 'gcc', 'clang',
        )):
            return "SUSPICIOUS"
        return "SAFE"

    async def stream_anomalies(self, interval: int = 3) -> AsyncGenerator[dict, None]:
        """Continuously monitors and yields anomaly events in real-time."""
        while True:
            try:
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

                # RAM pressure anomaly
                if metrics['ram_percent'] > 90:
                    yield {
                        "type": "RAM_PRESSURE",
                        "severity": "HIGH",
                        "message": f"RAM at {metrics['ram_percent']}%",
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

            except Exception as e:
                logger.error("Anomaly stream error: %s", e)

            await asyncio.sleep(interval)


monitor = SystemMonitor()
