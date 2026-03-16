import {
    Shield,
    Monitor,
    AlertTriangle,
    TrendingUp,
    Plus,
    Wifi,
    HardDrive,
    Copy,
    X,
} from 'lucide-react'
import { useState } from 'react'
import { MOCK_ENDPOINTS, MOCK_NETWORK } from '../../context/AuthContext'

function ScoreBadge({ score }) {
    const color =
        score >= 71 ? 'text-accent-green bg-accent-green/10 border-accent-green/30'
            : score >= 41 ? 'text-accent-orange bg-accent-orange/10 border-accent-orange/30'
                : 'text-accent-red bg-accent-red/10 border-accent-red/30'
    return (
        <span className={`text-sm font-semibold px-2.5 py-1 rounded-lg border ${color}`}>
            {score}/100
        </span>
    )
}

function StatusDot({ status }) {
    const cls =
        status === 'online' ? 'bg-accent-green animate-live-dot'
            : status === 'warning' ? 'bg-accent-orange animate-live-dot'
                : 'bg-text-tertiary'
    return <span className={`w-2 h-2 rounded-full inline-block ${cls}`} />
}

export default function AdminDashboard() {
    const [showInviteModal, setShowInviteModal] = useState(false)
    const [copied, setCopied] = useState(false)

    const fleetScore = Math.round(
        MOCK_ENDPOINTS.reduce((sum, ep) => sum + ep.score, 0) / MOCK_ENDPOINTS.length
    )
    const totalThreats = MOCK_ENDPOINTS.reduce((sum, ep) => sum + ep.threats, 0)

    const handleCopy = () => {
        navigator.clipboard.writeText('https://sentinel-ai.app/join/net-sentinel-001')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-text-primary">
                        {MOCK_NETWORK.company_name}
                    </h2>
                    <p className="text-sm text-text-secondary mt-1">Enterprise Fleet Security Overview</p>
                </div>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-green/10 border border-accent-green/30
                     text-accent-green text-sm font-medium cursor-pointer
                     hover:bg-accent-green/20 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Endpoint
                </button>
            </div>

            {/* Fleet Stats Row */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { icon: HardDrive, label: 'Connected Endpoints', value: MOCK_NETWORK.active_endpoints, color: 'text-accent-cyan' },
                    { icon: Shield, label: 'Fleet Security Score', value: `${fleetScore}/100`, color: fleetScore >= 71 ? 'text-accent-green' : 'text-accent-orange' },
                    { icon: AlertTriangle, label: 'Active Threats', value: totalThreats, color: totalThreats > 0 ? 'text-accent-red' : 'text-accent-green' },
                    { icon: TrendingUp, label: 'Uptime', value: '99.2%', color: 'text-accent-green' },
                ].map((card) => (
                    <div
                        key={card.label}
                        className="bg-bg-secondary border border-border-default rounded-lg p-5 flex items-center gap-4"
                    >
                        <card.icon className={`w-8 h-8 ${card.color} flex-shrink-0`} />
                        <div>
                            <p className="text-2xl font-semibold text-text-primary">{card.value}</p>
                            <p className="text-xs text-text-secondary">{card.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Endpoint Table */}
            <div className="bg-bg-secondary border border-border-default rounded-lg overflow-hidden">
                <div className="px-5 py-4 border-b border-border-default flex items-center justify-between">
                    <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-accent-cyan" />
                        Employee Endpoints
                    </h3>
                    <span className="text-xs text-text-tertiary">{MOCK_ENDPOINTS.length} devices</span>
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border-default text-text-tertiary text-xs uppercase tracking-wider">
                            <th className="text-left px-5 py-3 font-medium">Device</th>
                            <th className="text-left px-5 py-3 font-medium">OS</th>
                            <th className="text-left px-5 py-3 font-medium">Status</th>
                            <th className="text-left px-5 py-3 font-medium">Security Score</th>
                            <th className="text-left px-5 py-3 font-medium">Threats</th>
                            <th className="text-left px-5 py-3 font-medium">Last Seen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_ENDPOINTS.map((ep) => (
                            <tr
                                key={ep.id}
                                className="border-b border-border-default last:border-0 hover:bg-bg-hover transition-colors cursor-pointer"
                            >
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-2">
                                        <HardDrive className="w-4 h-4 text-text-tertiary" />
                                        <span className="text-text-primary font-medium">{ep.name}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-3.5 text-text-secondary font-mono text-xs">{ep.os}</td>
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-2">
                                        <StatusDot status={ep.status} />
                                        <span className="text-text-secondary capitalize">{ep.status}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-3.5">
                                    <ScoreBadge score={ep.score} />
                                </td>
                                <td className="px-5 py-3.5">
                                    {ep.threats > 0 ? (
                                        <span className="text-accent-red font-semibold">{ep.threats}</span>
                                    ) : (
                                        <span className="text-accent-green">0</span>
                                    )}
                                </td>
                                <td className="px-5 py-3.5 text-text-tertiary text-xs">{ep.lastSeen}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-bg-secondary border border-border-default rounded-xl w-full max-w-md p-6 animate-fade-in">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-text-primary">Add Endpoint</h3>
                            <button
                                onClick={() => setShowInviteModal(false)}
                                className="text-text-tertiary hover:text-text-primary cursor-pointer transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-sm text-text-secondary mb-4">
                            Share this invite link with your employee. They can install the Sentinel AI agent on their machine to join your fleet.
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-bg-tertiary border border-border-default rounded-lg px-3 py-2.5">
                                <code className="text-xs text-accent-cyan font-mono break-all">
                                    https://sentinel-ai.app/join/net-sentinel-001
                                </code>
                            </div>
                            <button
                                onClick={handleCopy}
                                className="flex-shrink-0 p-2.5 rounded-lg bg-accent-green/10 border border-accent-green/30
                           text-accent-green cursor-pointer hover:bg-accent-green/20 transition-colors"
                                aria-label="Copy link"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                        {copied && (
                            <p className="text-xs text-accent-green mt-2">Copied to clipboard!</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
