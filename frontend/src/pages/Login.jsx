import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Shield, Building2, User, Zap } from 'lucide-react'

export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleLogin = (role) => {
        login(role)
        navigate(role === 'ADMIN' ? '/admin/dashboard' : '/')
    }

    return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
            <div className="w-full max-w-lg animate-fade-in">
                {/* Logo & Branding */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-green/10 border border-accent-green/20 mb-5">
                        <Shield className="w-8 h-8 text-accent-green" />
                    </div>
                    <h1 className="text-3xl font-bold text-text-primary tracking-tight">Sentinel AI</h1>
                    <p className="text-text-secondary mt-2 text-sm">
                        AI-Powered Personal Cybersecurity Coaching Agent
                    </p>
                </div>

                {/* Role Selection Cards */}
                <div className="space-y-4">
                    {/* Admin / Enterprise */}
                    <button
                        onClick={() => handleLogin('ADMIN')}
                        className="w-full group cursor-pointer bg-bg-secondary border border-border-default rounded-xl p-6 text-left
                       hover:border-accent-cyan/40 hover:bg-bg-hover transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-accent-cyan/50"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent-cyan/10 flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-accent-cyan" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-semibold text-text-primary">Enterprise Admin</h3>
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent-cyan/15 text-accent-cyan uppercase tracking-wider">
                                        Fleet
                                    </span>
                                </div>
                                <p className="text-sm text-text-secondary">
                                    Manage your entire organization's security posture. Monitor employee endpoints, view fleet-wide threat analytics, and coordinate incident response.
                                </p>
                                <div className="flex items-center gap-1.5 mt-3 text-xs text-text-tertiary">
                                    <Zap className="w-3 h-3" />
                                    <span>4 endpoints connected</span>
                                </div>
                            </div>
                        </div>
                    </button>

                    {/* User / Personal */}
                    <button
                        onClick={() => handleLogin('USER')}
                        className="w-full group cursor-pointer bg-bg-secondary border border-border-default rounded-xl p-6 text-left
                       hover:border-accent-green/40 hover:bg-bg-hover transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-accent-green/50"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent-green/10 flex items-center justify-center">
                                <User className="w-6 h-6 text-accent-green" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-semibold text-text-primary">Personal / Employee</h3>
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent-green/15 text-accent-green uppercase tracking-wider">
                                        Endpoint
                                    </span>
                                </div>
                                <p className="text-sm text-text-secondary">
                                    Protect your own machine. See your personal security score, scan emails for phishing, monitor system processes, and chat with your AI security coach.
                                </p>
                                <div className="flex items-center gap-1.5 mt-3 text-xs text-text-tertiary">
                                    <Shield className="w-3 h-3" />
                                    <span>Local AI • Privacy-first</span>
                                </div>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Footer note */}
                <p className="text-center text-[11px] text-text-tertiary mt-8">
                    Demo mode — no credentials required. Select a role to explore.
                </p>
            </div>
        </div>
    )
}
