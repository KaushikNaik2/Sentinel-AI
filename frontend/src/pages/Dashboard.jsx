import { AlertTriangle, Wifi, User } from 'lucide-react'
import StatsBanner from '../components/dashboard/StatsBanner'
import SecurityScoreCard from '../components/dashboard/SecurityScoreCard'
import StatCard from '../components/dashboard/StatCard'
import AnomalyFeed from '../components/dashboard/AnomalyFeed'
import RiskBreakdown from '../components/dashboard/RiskBreakdown'
import NetworkConnections from '../components/dashboard/NetworkConnections'
import useSecurityStore from '../store/securityStore'

export default function Dashboard() {
    const securityScore = useSecurityStore((s) => s.securityScore)

    return (
        <div className="animate-fade-in space-y-6">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-text-primary">Security Overview</h2>
                    <p className="text-sm text-text-secondary mt-1">Your personal cybersecurity dashboard</p>
                </div>
                <div className="flex items-center gap-2 bg-bg-tertiary px-3 py-1.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-accent-green animate-live-dot" />
                    <span className="text-xs text-accent-green font-medium">All systems monitored</span>
                </div>
            </div>

            {/* Stats Banner (Patch 1) */}
            <StatsBanner />

            {/* Score + Stat cards row */}
            <div className="grid grid-cols-4 gap-4">
                <SecurityScoreCard score={securityScore} />
                <StatCard
                    icon={AlertTriangle}
                    label="Active Threats"
                    value={2}
                    color="text-accent-red"
                    link="/monitor"
                />
                <StatCard
                    icon={Wifi}
                    label="Processes Flagged"
                    value={5}
                    color="text-accent-orange"
                    link="/monitor"
                />
                <StatCard
                    icon={User}
                    label="Breaches Found"
                    value={3}
                    color="text-accent-cyan"
                    link="/breach"
                />
            </div>

            {/* Anomaly Feed + Risk Breakdown */}
            <div className="grid grid-cols-5 gap-4">
                <div className="col-span-3">
                    <AnomalyFeed />
                </div>
                <div className="col-span-2">
                    <RiskBreakdown />
                </div>
            </div>

            {/* Network Connections */}
            <NetworkConnections />
        </div>
    )
}
