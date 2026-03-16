import { useEffect, useRef, useState } from 'react'

// Mock anomaly data generator
const SEVERITIES = ['HIGH', 'MEDIUM', 'LOW']
const PROCESSES = ['chrome.exe', 'svchost.exe', 'node.exe', 'python.exe', 'powershell.exe', 'unknown_proc', 'miner_x.exe', 'backdoor_kit']
const DESCRIPTIONS = [
    'Unusual outbound connection to 185.220.101.xx',
    'High CPU usage detected — cryptominer signature',
    'Attempted access to /etc/shadow',
    'DNS query to known C2 domain',
    'Privilege escalation attempt via sudo',
    'Suspicious registry modification',
    'Outbound data exfiltration detected (2.3 MB)',
    'Port scan detected from internal IP',
    'Unauthorized SSH connection attempt',
    'Executable downloaded from untrusted source',
]

function generateAnomaly() {
    const severity = SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)]
    const process = PROCESSES[Math.floor(Math.random() * PROCESSES.length)]
    const desc = DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)]
    const now = new Date()
    const timestamp = now.toLocaleTimeString('en-US', { hour12: false })
    return { id: crypto.randomUUID(), severity, process, desc, timestamp }
}

function SeverityBadge({ severity }) {
    const cls =
        severity === 'HIGH' ? 'bg-accent-red/15 text-accent-red border-accent-red/40'
            : severity === 'MEDIUM' ? 'bg-accent-orange/15 text-accent-orange border-accent-orange/40'
                : 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan/40'
    return (
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${cls} uppercase`}>
            {severity}
        </span>
    )
}

export default function AnomalyFeed() {
    const [anomalies, setAnomalies] = useState(() => {
        // seed with 5 initial entries
        return Array.from({ length: 5 }, () => generateAnomaly())
    })
    const feedRef = useRef(null)

    // Generate new anomalies periodically
    useEffect(() => {
        const interval = setInterval(() => {
            setAnomalies((prev) => {
                const next = [generateAnomaly(), ...prev].slice(0, 50)
                return next
            })
        }, 4000 + Math.random() * 3000)
        return () => clearInterval(interval)
    }, [])

    // Auto-scroll to top on new entry
    useEffect(() => {
        if (feedRef.current) feedRef.current.scrollTop = 0
    }, [anomalies.length])

    return (
        <div className="bg-bg-secondary border border-border-default rounded-lg flex flex-col h-[320px]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-green animate-live-dot" />
                    <h3 className="text-sm font-semibold text-text-primary">Live Anomaly Feed</h3>
                </div>
                <span className="text-[11px] text-text-tertiary">{anomalies.length} events</span>
            </div>

            {/* Feed list */}
            <div ref={feedRef} className="flex-1 overflow-y-auto">
                {anomalies.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-text-tertiary text-sm">
                        <span className="w-2 h-2 rounded-full bg-accent-green animate-live-dot mr-2" />
                        Monitoring system… no anomalies detected
                    </div>
                ) : (
                    anomalies.map((a, i) => (
                        <div
                            key={a.id}
                            className={`flex items-start gap-3 px-4 py-2.5 border-b border-border-default last:border-0 text-xs
                         ${a.severity === 'HIGH' ? 'bg-accent-red/5' : a.severity === 'MEDIUM' ? 'bg-accent-orange/5' : ''}
                         ${i === 0 ? 'animate-fade-in' : ''}`}
                        >
                            <span className="text-text-tertiary font-mono flex-shrink-0 mt-0.5">{a.timestamp}</span>
                            <SeverityBadge severity={a.severity} />
                            <div className="flex-1 min-w-0">
                                <span className="text-text-primary font-mono">{a.process}</span>
                                <span className="text-text-tertiary mx-1">—</span>
                                <span className="text-text-secondary">{a.desc}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
