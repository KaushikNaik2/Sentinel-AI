import { useState, useEffect } from 'react'
import { Cpu, AlertTriangle } from 'lucide-react'

// Base processes
const BASE_PROCESSES = [
    { id: 1, name: 'System Idle Process', pid: 0, user: 'SYSTEM', cpu: 65.4, mem: '8 K', status: 'normal' },
    { id: 2, name: 'chrome.exe', pid: 14032, user: 'shivam', cpu: 12.1, mem: '1,245 M', status: 'normal' },
    { id: 3, name: 'svchost.exe', pid: 902, user: 'NETWORK SERVICE', cpu: 4.2, mem: '45 M', status: 'normal' },
    { id: 4, name: 'Discord.exe', pid: 8192, user: 'shivam', cpu: 2.5, mem: '340 M', status: 'normal' },
    { id: 5, name: 'Code.exe', pid: 12044, user: 'shivam', cpu: 8.4, mem: '850 M', status: 'normal' },
    { id: 6, name: 'node.exe', pid: 2104, user: 'shivam', cpu: 1.1, mem: '120 M', status: 'normal' },
]

// Occasional suspicious process injection
const SUSPICIOUS_PROCESS = {
    id: 999, name: 'miner_x64.exe', pid: 48912, user: 'SYSTEM', cpu: 85.9, mem: '2,100 M', status: 'flagged', reason: 'High CPU + Unknown Origin'
}

export default function ProcessList() {
    const [processes, setProcesses] = useState(BASE_PROCESSES)

    // Randomly inject a suspicious process and update metrics
    useEffect(() => {
        const interval = setInterval(() => {
            setProcesses(prev => {
                let next = prev.map(p => ({
                    ...p,
                    cpu: Math.max(0, p.cpu + (Math.random() * 2 - 1)).toFixed(1), // Jiggle CPU slightly
                }))

                // 10% chance to inject suspicious if not present
                if (!next.some(p => p.id === 999) && Math.random() < 0.1) {
                    next.splice(1, 0, SUSPICIOUS_PROCESS) // Insert near top
                }
                // 5% chance to remove suspicious
                else if (next.some(p => p.id === 999) && Math.random() < 0.05) {
                    next = next.filter(p => p.id !== 999)
                }

                // Sort by CPU descending (excluding idle process purely for realism UX, but we leave it at top for demo)
                next.sort((a, b) => b.cpu - a.cpu)

                return next
            })
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="bg-bg-secondary border border-border-default rounded-lg overflow-hidden h-[400px] flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border-default">
                <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-accent-cyan" />
                    <h3 className="text-sm font-semibold text-text-primary">Running Processes</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-live-dot" />
                    <span className="text-[11px] text-text-tertiary">Refreshes every 3s</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <table className="w-full text-xs">
                    <thead className="bg-bg-tertiary sticky top-0 z-10">
                        <tr className="border-b border-border-default text-text-tertiary uppercase tracking-wider">
                            <th className="text-left px-5 py-2.5 font-medium">Name</th>
                            <th className="text-left px-5 py-2.5 font-medium">PID</th>
                            <th className="text-left px-5 py-2.5 font-medium">User</th>
                            <th className="text-right px-5 py-2.5 font-medium">CPU</th>
                            <th className="text-right px-5 py-2.5 font-medium">Memory</th>
                        </tr>
                    </thead>
                    <tbody>
                        {processes.map((proc) => (
                            <tr
                                key={proc.id}
                                className={`border-b border-border-default last:border-0 transition-colors ${proc.status === 'flagged'
                                        ? 'bg-accent-red/10 border-l-2 border-l-accent-red'
                                        : 'hover:bg-bg-hover border-l-2 border-l-transparent'
                                    }`}
                            >
                                <td className="px-5 py-3">
                                    <div className="flex flex-col">
                                        <span className={`font-mono font-medium ${proc.status === 'flagged' ? 'text-accent-red' : 'text-text-primary'}`}>
                                            {proc.name}
                                        </span>
                                        {proc.reason && (
                                            <span className="flex items-center gap-1 text-[10px] text-accent-red mt-0.5">
                                                <AlertTriangle className="w-3 h-3" />
                                                {proc.reason}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-5 py-3 font-mono text-text-secondary">{proc.pid}</td>
                                <td className="px-5 py-3 text-text-secondary">{proc.user}</td>
                                <td className="px-5 py-3 text-right font-mono text-text-primary">{proc.cpu}%</td>
                                <td className="px-5 py-3 text-right font-mono text-text-secondary">{proc.mem}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
