import { useState, useEffect } from 'react'
import { Globe, AlertTriangle } from 'lucide-react'

const FLAGS = {
    US: '🇺🇸', CN: '🇨🇳', RU: '🇷🇺', DE: '🇩🇪', IN: '🇮🇳', BR: '🇧🇷', GB: '🇬🇧', NL: '🇳🇱', FR: '🇫🇷', JP: '🇯🇵',
}

const MOCK_CONNECTIONS = [
    { id: 1, process: 'chrome.exe', remoteIP: '142.250.190.46', port: 443, country: 'US', city: 'Mountain View', status: 'ESTABLISHED', suspicious: false },
    { id: 2, process: 'node.exe', remoteIP: '104.16.249.249', port: 443, country: 'US', city: 'San Francisco', status: 'ESTABLISHED', suspicious: false },
    { id: 3, process: 'svchost.exe', remoteIP: '185.220.101.34', port: 8443, country: 'RU', city: 'Moscow', status: 'ESTABLISHED', suspicious: true },
    { id: 4, process: 'python.exe', remoteIP: '93.184.216.34', port: 80, country: 'DE', city: 'Frankfurt', status: 'TIME_WAIT', suspicious: false },
    { id: 5, process: 'unknown_proc', remoteIP: '45.155.205.99', port: 4444, country: 'CN', city: 'Beijing', status: 'SYN_SENT', suspicious: true },
    { id: 6, process: 'outlook.exe', remoteIP: '40.97.161.2', port: 443, country: 'NL', city: 'Amsterdam', status: 'ESTABLISHED', suspicious: false },
    { id: 7, process: 'slack.exe', remoteIP: '34.226.134.26', port: 443, country: 'US', city: 'Virginia', status: 'ESTABLISHED', suspicious: false },
]

export default function NetworkConnections() {
    const [connections, setConnections] = useState(MOCK_CONNECTIONS)
    const [tick, setTick] = useState(0)

    // Simulate refresh every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => setTick((t) => t + 1), 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="bg-bg-secondary border border-border-default rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border-default">
                <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-accent-cyan" />
                    <h3 className="text-sm font-semibold text-text-primary">Network Connections</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-live-dot" />
                    <span className="text-[11px] text-text-tertiary">Refreshes every 3s</span>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-border-default text-text-tertiary uppercase tracking-wider">
                            <th className="text-left px-5 py-2.5 font-medium">Process</th>
                            <th className="text-left px-5 py-2.5 font-medium">Remote IP</th>
                            <th className="text-left px-5 py-2.5 font-medium">Port</th>
                            <th className="text-left px-5 py-2.5 font-medium">Location</th>
                            <th className="text-left px-5 py-2.5 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {connections.map((conn) => (
                            <tr
                                key={conn.id}
                                className={`border-b border-border-default last:border-0 transition-colors ${conn.suspicious
                                        ? 'bg-accent-red/5 hover:bg-accent-red/10'
                                        : 'hover:bg-bg-hover'
                                    }`}
                            >
                                <td className="px-5 py-2.5">
                                    <div className="flex items-center gap-1.5">
                                        {conn.suspicious && <AlertTriangle className="w-3 h-3 text-accent-red" />}
                                        <span className={`font-mono ${conn.suspicious ? 'text-accent-red' : 'text-text-primary'}`}>
                                            {conn.process}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-5 py-2.5 font-mono text-text-secondary">{conn.remoteIP}</td>
                                <td className="px-5 py-2.5 font-mono text-text-secondary">{conn.port}</td>
                                <td className="px-5 py-2.5">
                                    <span className="mr-1">{FLAGS[conn.country] || '🌐'}</span>
                                    <span className="text-text-secondary">{conn.city}</span>
                                </td>
                                <td className="px-5 py-2.5">
                                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border uppercase ${conn.status === 'ESTABLISHED' ? 'bg-accent-green/10 text-accent-green border-accent-green/30'
                                            : conn.status === 'SYN_SENT' ? 'bg-accent-orange/10 text-accent-orange border-accent-orange/30'
                                                : 'bg-bg-tertiary text-text-tertiary border-border-default'
                                        }`}>
                                        {conn.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
