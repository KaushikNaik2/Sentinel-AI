import { Activity } from 'lucide-react'
import MetricsChart from '../components/monitor/MetricsChart'
import ProcessList from '../components/monitor/ProcessList'

export default function Monitor() {
    return (
        <div className="animate-fade-in space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between border-b border-border-default pb-4">
                <div>
                    <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
                        <Activity className="w-6 h-6 text-accent-cyan" />
                        Live System Monitor
                    </h2>
                    <p className="text-sm text-text-secondary mt-1">
                        Real-time telemetry and process monitoring powered by local OS hooks.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
                <MetricsChart />
                <ProcessList />
            </div>
        </div>
    )
}
