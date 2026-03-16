import { Shield, Wifi } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function TopBar() {
    const { user } = useAuth()

    return (
        <header className="flex items-center justify-between px-6 py-3 bg-bg-secondary border-b border-border-default">
            {/* Left — Branding */}
            <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent-green" />
                <h1 className="text-base font-semibold text-text-primary tracking-tight">
                    Sentinel AI
                </h1>
                {user?.role === 'ADMIN' && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent-cyan/15 text-accent-cyan ml-1">
                        ADMIN
                    </span>
                )}
            </div>

            {/* Center — Local Model Badge */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-bg-tertiary px-3 py-1.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-accent-green animate-live-dot" />
                    <span className="text-xs font-mono text-accent-green">mistral-7b — LOCAL</span>
                </div>
                <div className="flex items-center gap-2 bg-bg-tertiary px-3 py-1.5 rounded-full">
                    <Wifi className="w-3.5 h-3.5 text-accent-cyan" />
                    <span className="text-xs text-accent-cyan">System Monitoring Active</span>
                </div>
            </div>

            {/* Right — User context */}
            <div className="text-sm text-text-secondary">
                {user?.email || 'No email scanned'}
            </div>
        </header>
    )
}
